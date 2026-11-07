import {
  hashPassword, verifyPassword, createSession, getSessionAdmin, deleteSession,
  getCookie, sessionCookie, clearCookie,
} from './auth.js';

const CANONICAL_HOST = 'www.adegamm.com.br';

// Tudo que o admin edita fora do cardápio em si. Os valores daqui são o
// padrão quando a chave ainda não existe no banco, e a lista é também a
// whitelist do que o PUT aceita gravar.
export const SETTINGS_DEFAULTS = {
  store_name: 'Adega MM',
  store_subtitle: 'Distribuidora de Bebidas',
  tagline: 'Cerveja gelada, doses e combos pra sua night',
  whatsapp: '11983463846',
  instagram: 'adegam.m',
  address: 'Rua Principal, 12 — Divineia',
  hours: '',
  menu_title: 'Cardápio',
  menu_footer: 'Cardápio sujeito a alterações sem aviso prévio.',
  order_greeting: 'Olá! Quero fazer um pedido na Adega MM:',
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...(init.headers || {}) },
  });
}
const badRequest = (message) => json({ error: message }, { status: 400 });
const unauthorized = () => json({ error: 'Não autenticado' }, { status: 401 });
const notFound = () => json({ error: 'Não encontrado' }, { status: 404 });

function genId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
}

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

// Aceita "8", "8,5", "8,50", "R$ 1.300,00". Devolve centavos ou null.
export function priceToCents(text) {
  const t = String(text ?? '').replace(/R\$/gi, '').replace(/\s+/g, '');
  const m = t.match(/^(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?$/);
  if (!m) return null;
  const reais = parseInt(m[1].replace(/\./g, ''), 10);
  const cents = m[2] ? parseInt(m[2].padEnd(2, '0'), 10) : 0;
  return reais * 100 + cents;
}

export function formatPrice(cents) {
  const reais = Math.floor(cents / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${reais},${String(cents % 100).padStart(2, '0')}`;
}

function slugify(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'secao';
}

/* ------------------------------ rotas ------------------------------ */

const routes = [];
function route(method, pattern, handler) {
  routes.push({ method, parts: pattern.split('/').filter(Boolean), handler });
}

function matchRoute(method, pathname) {
  const pathParts = pathname.split('/').filter(Boolean);
  for (const r of routes) {
    if (r.method !== method || r.parts.length !== pathParts.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < r.parts.length; i++) {
      if (r.parts[i].startsWith(':')) params[r.parts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      else if (r.parts[i] !== pathParts[i]) { ok = false; break; }
    }
    if (ok) return { handler: r.handler, params };
  }
  return null;
}

function admin(handler) {
  return async (request, env, params) => {
    const user = await getSessionAdmin(env.DB, getCookie(request));
    if (!user) return unauthorized();
    return handler(request, env, params, user);
  };
}

async function body(request) {
  return request.json().catch(() => ({}));
}

/* ----------------------------- leitura ----------------------------- */

async function readSettings(env) {
  const { results } = await env.DB.prepare('SELECT key, value FROM settings').all();
  const out = { ...SETTINGS_DEFAULTS };
  for (const r of results) if (r.key in SETTINGS_DEFAULTS) out[r.key] = r.value;
  return out;
}

async function readMenu(env, { includeHidden }) {
  const { results: sections } = await env.DB.prepare('SELECT * FROM sections ORDER BY sort_order').all();
  const { results: groups } = await env.DB.prepare('SELECT * FROM groups ORDER BY sort_order').all();
  const { results: items } = await env.DB.prepare(
    includeHidden ? 'SELECT * FROM items ORDER BY sort_order' : 'SELECT * FROM items WHERE hidden = 0 ORDER BY sort_order'
  ).all();

  const groupsBySection = {};
  const groupById = {};
  for (const g of groups) {
    const out = { id: g.id, title: g.title, note: g.note || '', keywords: g.keywords || '', items: [] };
    (groupsBySection[g.section_id] ||= []).push(out);
    groupById[g.id] = out;
  }
  for (const it of items) {
    groupById[it.group_id]?.items.push({
      id: it.id,
      name: it.name,
      unit: it.unit || '',
      price: formatPrice(it.price_cents),
      price_cents: it.price_cents,
      note: it.note || '',
      sold_out: !!it.sold_out,
      ...(includeHidden ? { hidden: !!it.hidden } : {}),
    });
  }

  let out = sections.map(s => ({ id: s.id, title: s.title, groups: groupsBySection[s.id] || [] }));
  if (!includeHidden) {
    out = out
      .map(s => ({ ...s, groups: s.groups.filter(g => g.items.length) }))
      .filter(s => s.groups.length);
  }
  return out;
}

route('GET', '/api/menu', async (request, env) => {
  const [settings, sections] = await Promise.all([readSettings(env), readMenu(env, { includeHidden: false })]);
  return json({ settings, sections });
});

route('GET', '/api/settings', async (request, env) => json({ settings: await readSettings(env) }));

/* ------------------------------ login ------------------------------ */

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_MINUTES = 15;

route('POST', '/api/admin/login', async (request, env) => {
  const { username, password } = await body(request);
  if (!username || !password) return badRequest('Informe usuário e senha');
  const user = String(username).trim().toLowerCase();

  const attempt = await env.DB.prepare('SELECT * FROM login_attempts WHERE username = ?').bind(user).first();
  if (attempt?.locked_until && new Date(attempt.locked_until) > new Date()) {
    return json({ error: 'Muitas tentativas. Tente de novo em alguns minutos.' }, { status: 429 });
  }

  const row = await env.DB.prepare('SELECT * FROM admin_users WHERE username = ?').bind(user).first();
  if (!row || !(await verifyPassword(String(password), row.password_hash))) {
    const failCount = (attempt?.fail_count || 0) + 1;
    const lockedUntil = failCount >= LOGIN_MAX_ATTEMPTS
      ? new Date(Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000).toISOString() : null;
    await env.DB.prepare(
      `INSERT INTO login_attempts (username, fail_count, locked_until) VALUES (?, ?, ?)
       ON CONFLICT(username) DO UPDATE SET fail_count = excluded.fail_count, locked_until = excluded.locked_until`
    ).bind(user, failCount, lockedUntil).run();
    return json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
  }

  await env.DB.prepare('DELETE FROM login_attempts WHERE username = ?').bind(user).run();
  const { token, expiresAt } = await createSession(env.DB, row.id);
  return json({ ok: true, username: row.username }, { headers: { 'Set-Cookie': sessionCookie(token, expiresAt) } });
});

route('POST', '/api/admin/logout', async (request, env) => {
  await deleteSession(env.DB, getCookie(request));
  return json({ ok: true }, { headers: { 'Set-Cookie': clearCookie() } });
});

route('GET', '/api/admin/me', admin(async (request, env, params, user) => json({ username: user.username })));

route('POST', '/api/admin/password', admin(async (request, env, params, user) => {
  const b = await body(request);
  if (!(await verifyPassword(String(b.current || ''), user.password_hash))) return badRequest('Senha atual incorreta');
  const next = String(b.next || '');
  if (next.length < 8) return badRequest('A nova senha precisa ter pelo menos 8 caracteres');
  await env.DB.batch([
    env.DB.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').bind(await hashPassword(next), user.id),
    // derruba as outras sessões abertas com a senha antiga
    env.DB.prepare('DELETE FROM admin_sessions WHERE admin_id = ? AND token != ?').bind(user.id, getCookie(request)),
  ]);
  return json({ ok: true });
}));

/* ---------------------------- configurações ---------------------------- */

route('PUT', '/api/admin/settings', admin(async (request, env) => {
  const b = await body(request);
  const stmts = [];
  for (const key of Object.keys(SETTINGS_DEFAULTS)) {
    if (!(key in b)) continue;
    let value = clean(b[key], 300);
    if (key === 'whatsapp') {
      value = value.replace(/\D/g, '');
      if (value.length < 10 || value.length > 13) return badRequest('WhatsApp inválido — use DDD + número, ex: 11983463846');
    }
    if (key === 'instagram') value = value.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/.*$/, '');
    if (key === 'store_name' && !value) return badRequest('O nome da loja não pode ficar vazio');
    stmts.push(env.DB.prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    ).bind(key, value));
  }
  if (stmts.length) await env.DB.batch(stmts);
  return json({ settings: await readSettings(env) });
}));

/* ------------------------------ cardápio ------------------------------ */

route('GET', '/api/admin/menu', admin(async (request, env) => json({ sections: await readMenu(env, { includeHidden: true }) })));

async function nextOrder(env, table, scopeColumn, scopeValue) {
  const sql = scopeColumn
    ? `SELECT COALESCE(MAX(sort_order), -1) AS m FROM ${table} WHERE ${scopeColumn} = ?`
    : `SELECT COALESCE(MAX(sort_order), -1) AS m FROM ${table}`;
  const stmt = env.DB.prepare(sql);
  const row = await (scopeColumn ? stmt.bind(scopeValue) : stmt).first();
  return (row?.m ?? -1) + 1;
}

// Seções
route('POST', '/api/admin/sections', admin(async (request, env) => {
  const title = clean((await body(request)).title, 60);
  if (!title) return badRequest('Informe o nome da seção');
  // o id vira a âncora do menu (#cervejas), então nasce do nome e não muda mais
  let id = slugify(title);
  for (let n = 2; await env.DB.prepare('SELECT 1 FROM sections WHERE id = ?').bind(id).first(); n++) id = `${slugify(title)}-${n}`;
  await env.DB.prepare('INSERT INTO sections (id, title, sort_order) VALUES (?, ?, ?)')
    .bind(id, title, await nextOrder(env, 'sections')).run();
  return json({ id });
}));

route('PUT', '/api/admin/sections/:id', admin(async (request, env, params) => {
  const title = clean((await body(request)).title, 60);
  if (!title) return badRequest('Informe o nome da seção');
  const r = await env.DB.prepare('UPDATE sections SET title = ? WHERE id = ?').bind(title, params.id).run();
  return r.meta?.changes === 0 ? notFound() : json({ ok: true });
}));

route('DELETE', '/api/admin/sections/:id', admin(async (request, env, params) => {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM items WHERE group_id IN (SELECT id FROM groups WHERE section_id = ?)').bind(params.id),
    env.DB.prepare('DELETE FROM groups WHERE section_id = ?').bind(params.id),
    env.DB.prepare('DELETE FROM sections WHERE id = ?').bind(params.id),
  ]);
  return json({ ok: true });
}));

// Grupos (subtítulos dentro da seção: "Long Neck", "Latas"...)
route('POST', '/api/admin/groups', admin(async (request, env) => {
  const b = await body(request);
  const title = clean(b.title, 60);
  if (!title) return badRequest('Informe o nome do grupo');
  if (!(await env.DB.prepare('SELECT 1 FROM sections WHERE id = ?').bind(b.sectionId).first())) return badRequest('Seção inválida');
  const id = genId('g');
  await env.DB.prepare('INSERT INTO groups (id, section_id, title, note, keywords, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, b.sectionId, title, clean(b.note, 300), '', await nextOrder(env, 'groups', 'section_id', b.sectionId)).run();
  return json({ id });
}));

route('PUT', '/api/admin/groups/:id', admin(async (request, env, params) => {
  const b = await body(request);
  const title = clean(b.title, 60);
  if (!title) return badRequest('Informe o nome do grupo');
  const r = await env.DB.prepare('UPDATE groups SET title = ?, note = ? WHERE id = ?')
    .bind(title, clean(b.note, 300), params.id).run();
  return r.meta?.changes === 0 ? notFound() : json({ ok: true });
}));

route('DELETE', '/api/admin/groups/:id', admin(async (request, env, params) => {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM items WHERE group_id = ?').bind(params.id),
    env.DB.prepare('DELETE FROM groups WHERE id = ?').bind(params.id),
  ]);
  return json({ ok: true });
}));

// Produtos
function readItem(b) {
  const name = clean(b.name, 120);
  if (!name) return { error: 'Informe o nome do produto' };
  const cents = priceToCents(b.price);
  if (cents == null) return { error: 'Preço inválido — use o formato 8,00' };
  return { name, cents, unit: clean(b.unit, 40), note: clean(b.note, 300) };
}

route('POST', '/api/admin/items', admin(async (request, env) => {
  const b = await body(request);
  const it = readItem(b);
  if (it.error) return badRequest(it.error);
  if (!(await env.DB.prepare('SELECT 1 FROM groups WHERE id = ?').bind(b.groupId).first())) return badRequest('Grupo inválido');
  const id = genId('i');
  await env.DB.prepare(
    'INSERT INTO items (id, group_id, name, unit, price_cents, note, sold_out, hidden, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, b.groupId, it.name, it.unit, it.cents, it.note, b.sold_out ? 1 : 0, b.hidden ? 1 : 0,
    await nextOrder(env, 'items', 'group_id', b.groupId)).run();
  return json({ id, price: formatPrice(it.cents) });
}));

route('PUT', '/api/admin/items/:id', admin(async (request, env, params) => {
  const b = await body(request);
  const it = readItem(b);
  if (it.error) return badRequest(it.error);
  const r = await env.DB.prepare(
    'UPDATE items SET name = ?, unit = ?, price_cents = ?, note = ?, sold_out = ?, hidden = ? WHERE id = ?'
  ).bind(it.name, it.unit, it.cents, it.note, b.sold_out ? 1 : 0, b.hidden ? 1 : 0, params.id).run();
  return r.meta?.changes === 0 ? notFound() : json({ ok: true, price: formatPrice(it.cents) });
}));

route('DELETE', '/api/admin/items/:id', admin(async (request, env, params) => {
  await env.DB.prepare('DELETE FROM items WHERE id = ?').bind(params.id).run();
  return json({ ok: true });
}));

// Reordenar: troca de lugar com o vizinho (dois UPDATEs num batch), em vez de
// aceitar uma lista inteira do cliente — não tem como sobrar buraco ou
// sort_order repetido.
function moveRoute(path, table, scopeColumn) {
  route('PUT', path, admin(async (request, env, params) => {
    const { direction } = await body(request);
    if (!['up', 'down'].includes(direction)) return badRequest('Direção inválida');
    const row = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(params.id).first();
    if (!row) return notFound();
    const cmp = direction === 'up' ? '<' : '>';
    const ord = direction === 'up' ? 'DESC' : 'ASC';
    const scope = scopeColumn ? `AND ${scopeColumn} = ?` : '';
    const args = scopeColumn ? [row.sort_order, row[scopeColumn]] : [row.sort_order];
    const other = await env.DB.prepare(
      `SELECT * FROM ${table} WHERE sort_order ${cmp} ? ${scope} ORDER BY sort_order ${ord} LIMIT 1`
    ).bind(...args).first();
    if (!other) return json({ ok: true, moved: false });
    await env.DB.batch([
      env.DB.prepare(`UPDATE ${table} SET sort_order = ? WHERE id = ?`).bind(other.sort_order, row.id),
      env.DB.prepare(`UPDATE ${table} SET sort_order = ? WHERE id = ?`).bind(row.sort_order, other.id),
    ]);
    return json({ ok: true, moved: true });
  }));
}
moveRoute('/api/admin/sections/:id/move', 'sections', null);
moveRoute('/api/admin/groups/:id/move', 'groups', 'section_id');
moveRoute('/api/admin/items/:id/move', 'items', 'group_id');

/* ------------------------------ entrada ------------------------------ */

// /loja é o mesmo cardápio, sem carrinho (o script decide pelo caminho).
// Aponta pra forma sem extensão: pedir "/cardapio.html" ao asset store
// devolve redirect pra "/cardapio".
const PATH_ALIAS = { '/loja': '/cardapio' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'adegamm.com.br') {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith('/api/')) {
      const match = matchRoute(request.method, url.pathname);
      if (!match) return notFound();
      try {
        return await match.handler(request, env, match.params);
      } catch (err) {
        console.error(err);
        return json({ error: 'Erro interno' }, { status: 500 });
      }
    }

    const path = url.pathname.replace(/\/+$/, '') || '/';
    let assetRequest = request;
    if (PATH_ALIAS[path]) {
      const target = new URL(request.url);
      target.pathname = PATH_ALIAS[path];
      assetRequest = new Request(target, request);
    }
    const res = await env.ASSETS.fetch(assetRequest);

    if (path === '/admin' || path === '/admin.html') {
      const out = new Response(res.body, res);
      out.headers.set('X-Robots-Tag', 'noindex, nofollow');
      out.headers.set('Cache-Control', 'no-store');
      return out;
    }
    return res;
  },
};
