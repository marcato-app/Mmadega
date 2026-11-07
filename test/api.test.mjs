// Testes do Worker (API + roteamento) contra SQLite real (node:sqlite),
// carregado com as mesmas migrações que vão pro D1.
//
//   node test/api.test.mjs

import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../src/index.js';
import { hashPassword } from '../src/auth.js';

function makeD1(db) {
  return {
    prepare(sql) {
      const stmt = db.prepare(sql);
      let args = [];
      return {
        bind(...a) { args = a; return this; },
        async all() { return { results: stmt.all(...args) }; },
        async first() { const r = stmt.get(...args); return r === undefined ? null : r; },
        async run() { const info = stmt.run(...args); return { success: true, meta: { changes: info.changes } }; },
        _run() { return stmt.run(...args); },
      };
    },
    async batch(stmts) {
      db.exec('BEGIN');
      try {
        const out = stmts.map(s => s._run());
        db.exec('COMMIT');
        return out;
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }
    },
  };
}

const db = new DatabaseSync(':memory:');
db.exec('PRAGMA foreign_keys = ON'); // D1 liga por padrão
const migration = (f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8');
db.exec(migration('001_estrutura.sql'));
db.exec(migration('002_cardapio.sql'));
db.exec(migration('003_admin.sql')); // garante que o SQL do usuário roda

const assetHits = [];
const env = {
  DB: makeD1(db),
  ASSETS: {
    fetch: async (req) => {
      assetHits.push(new URL(req.url).pathname);
      return new Response('<html>asset</html>', { status: 200, headers: { 'Content-Type': 'text/html' } });
    },
  },
};

let pass = 0, fail = 0;
function check(label, cond, detail) {
  if (cond) { pass++; console.log('ok    ' + label); }
  else { fail++; console.log('FAIL  ' + label + (detail !== undefined ? '  — ' + JSON.stringify(detail) : '')); }
}

function req(method, path, { body, cookie, host = 'www.adegamm.com.br' } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers.Cookie = cookie;
  return worker.fetch(new Request(`https://${host}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined, redirect: 'manual',
  }), env, {});
}
const cookieFrom = (res) => (res.headers.get('Set-Cookie') || '').split(';')[0];
const allItems = (menu) => menu.sections.flatMap(s => s.groups.flatMap(g => g.items));

async function main() {
  // senha conhecida pros testes, por cima da provisória da migração 003
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(await hashPassword('senha-teste-1'), 'adegamm');

  /* ---------- cardápio público ---------- */
  let res = await req('GET', '/api/menu');
  let menu = await res.json();
  check('GET /api/menu responde 200', res.status === 200);
  check('cardápio inicial tem as 7 seções do PDF', menu.sections.length === 7, menu.sections.length);
  check('cardápio inicial tem os 302 produtos', allItems(menu).length === 302, allItems(menu).length);
  check('preço vem formatado', allItems(menu)[0].price === 'R$ 8,00', allItems(menu)[0].price);
  check('milhar formatado (Blue Label)', allItems(menu).find(i => i.name === 'Blue Label')?.price === 'R$ 1.300,00');
  check('configurações padrão vêm junto', menu.settings.store_name === 'Adega MM' && menu.settings.whatsapp === '11983463846');
  check('cardápio público não expõe o campo hidden', !('hidden' in allItems(menu)[0]));

  /* ---------- auth ---------- */
  res = await req('GET', '/api/admin/menu');
  check('admin sem login → 401', res.status === 401);
  res = await req('PUT', '/api/admin/settings', { body: { store_name: 'X' } });
  check('salvar sem login → 401', res.status === 401);

  res = await req('POST', '/api/admin/login', { body: { username: 'adegamm', password: 'errada' } });
  check('senha errada → 401', res.status === 401);
  res = await req('POST', '/api/admin/login', { body: { username: 'ADEGAMM ', password: 'senha-teste-1' } });
  const cookie = cookieFrom(res);
  check('login aceita usuário com maiúscula/espaço', res.status === 200 && cookie.startsWith('adegamm_admin='));
  check('cookie é HttpOnly e Secure', /HttpOnly/.test(res.headers.get('Set-Cookie')) && /Secure/.test(res.headers.get('Set-Cookie')));
  res = await req('GET', '/api/admin/me', { cookie });
  check('/me com cookie', (await res.json()).username === 'adegamm');

  for (let i = 0; i < 5; i++) await req('POST', '/api/admin/login', { body: { username: 'outro', password: 'x' } });
  res = await req('POST', '/api/admin/login', { body: { username: 'outro', password: 'x' } });
  check('5 erros seguidos travam o login', res.status === 429);

  /* ---------- configurações ---------- */
  res = await req('PUT', '/api/admin/settings', { cookie, body: { whatsapp: '123' } });
  check('WhatsApp curto demais → 400', res.status === 400);
  res = await req('PUT', '/api/admin/settings', { cookie, body: { store_name: '' } });
  check('nome vazio → 400', res.status === 400);
  res = await req('PUT', '/api/admin/settings', {
    cookie,
    body: { whatsapp: '(11) 97777-6666', instagram: '@adega.nova', hours: 'Todo dia, 10h–23h', tagline: '  Frase nova  ', inventada: 'x' },
  });
  let s = (await res.json()).settings;
  check('WhatsApp guardado só com números', s.whatsapp === '11977776666', s.whatsapp);
  check('Instagram sem @', s.instagram === 'adega.nova', s.instagram);
  check('texto aparado', s.tagline === 'Frase nova');
  check('chave desconhecida ignorada', !('inventada' in s) && !db.prepare("SELECT 1 FROM settings WHERE key='inventada'").get());
  res = await req('PUT', '/api/admin/settings', { cookie, body: { instagram: 'https://www.instagram.com/adegam.m/' } });
  check('Instagram colado como link vira usuário', (await res.json()).settings.instagram === 'adegam.m');
  s = (await (await req('GET', '/api/settings')).json()).settings;
  check('GET /api/settings público reflete o salvo', s.hours === 'Todo dia, 10h–23h' && s.whatsapp === '11977776666');

  /* ---------- produtos ---------- */
  const latas = db.prepare("SELECT id FROM groups WHERE title = 'Latas'").get().id;
  res = await req('POST', '/api/admin/items', { cookie, body: { groupId: latas, name: 'Brahma', unit: '350ml', price: '5,5', note: 'Gelada' } });
  const created = await res.json();
  check('criar produto', res.status === 200 && created.price === 'R$ 5,50', created);
  check('produto novo vai pro fim do grupo',
    db.prepare('SELECT MAX(sort_order) m FROM items WHERE group_id = ?').get(latas).m === db.prepare('SELECT sort_order FROM items WHERE id = ?').get(created.id).sort_order);
  res = await req('POST', '/api/admin/items', { cookie, body: { groupId: latas, name: 'X', price: 'abc' } });
  check('preço inválido → 400', res.status === 400);
  res = await req('POST', '/api/admin/items', { cookie, body: { groupId: 'nao-existe', name: 'X', price: '1' } });
  check('grupo inválido → 400', res.status === 400);

  res = await req('PUT', `/api/admin/items/${created.id}`, { cookie, body: { name: 'Brahma Chopp', unit: '350ml', price: 'R$ 6,00', note: '', sold_out: true, hidden: false } });
  check('editar produto', res.status === 200);
  menu = await (await req('GET', '/api/menu')).json();
  let brahma = allItems(menu).find(i => i.id === created.id);
  check('edição aparece no cardápio', brahma?.name === 'Brahma Chopp' && brahma.price === 'R$ 6,00');
  check('esgotado aparece marcado no cardápio', brahma?.sold_out === true);

  await req('PUT', `/api/admin/items/${created.id}`, { cookie, body: { name: 'Brahma Chopp', price: '6', hidden: true } });
  menu = await (await req('GET', '/api/menu')).json();
  check('produto oculto some do cardápio público', !allItems(menu).some(i => i.id === created.id));
  const adminMenu = await (await req('GET', '/api/admin/menu', { cookie })).json();
  check('produto oculto continua no admin', allItems(adminMenu).find(i => i.id === created.id)?.hidden === true);

  res = await req('PUT', '/api/admin/items/nao-existe', { cookie, body: { name: 'X', price: '1' } });
  check('editar produto inexistente → 404', res.status === 404);

  /* ---------- reordenar ---------- */
  const order = (g) => db.prepare('SELECT id FROM items WHERE group_id = ? ORDER BY sort_order').all(g).map(r => r.id);
  const before = order(latas);
  res = await req('PUT', `/api/admin/items/${before[1]}/move`, { cookie, body: { direction: 'up' } });
  const after = order(latas);
  check('subir produto troca com o de cima', after[0] === before[1] && after[1] === before[0]);
  res = await req('PUT', `/api/admin/items/${after[0]}/move`, { cookie, body: { direction: 'up' } });
  check('subir o primeiro não faz nada', (await res.json()).moved === false);
  res = await req('PUT', '/api/admin/sections/tabacaria/move', { cookie, body: { direction: 'up' } });
  const secs = db.prepare('SELECT id FROM sections ORDER BY sort_order').all().map(r => r.id);
  check('subir seção', secs.indexOf('tabacaria') === secs.indexOf('drinks') - 1, secs);

  /* ---------- seções e grupos ---------- */
  res = await req('POST', '/api/admin/sections', { cookie, body: { title: 'Petiscos & Porções' } });
  const sec1 = (await res.json()).id;
  res = await req('POST', '/api/admin/sections', { cookie, body: { title: 'Petiscos & porções' } });
  const sec2 = (await res.json()).id;
  check('id da seção nasce do nome', sec1 === 'petiscos-porcoes', sec1);
  check('nome repetido ganha sufixo', sec2 === 'petiscos-porcoes-2', sec2);

  res = await req('POST', '/api/admin/groups', { cookie, body: { sectionId: sec1, title: 'Fritos', note: 'Serve 2' } });
  const grp = (await res.json()).id;
  await req('POST', '/api/admin/items', { cookie, body: { groupId: grp, name: 'Batata', price: '25' } });
  menu = await (await req('GET', '/api/menu')).json();
  const pet = menu.sections.find(x => x.id === sec1);
  check('seção nova aparece com grupo e produto', pet?.groups[0]?.note === 'Serve 2' && pet.groups[0].items[0].name === 'Batata');
  check('seção vazia não aparece no cardápio público', !menu.sections.some(x => x.id === sec2));

  res = await req('PUT', `/api/admin/groups/${grp}`, { cookie, body: { title: 'Porções fritas', note: '' } });
  check('editar grupo', res.status === 200 && db.prepare('SELECT title FROM groups WHERE id = ?').get(grp).title === 'Porções fritas');
  res = await req('PUT', `/api/admin/sections/${sec1}`, { cookie, body: { title: 'Petiscos' } });
  check('renomear seção mantém o id', res.status === 200 && db.prepare('SELECT title FROM sections WHERE id = ?').get(sec1).title === 'Petiscos');

  res = await req('DELETE', `/api/admin/sections/${sec1}`, { cookie });
  check('excluir seção leva grupos e produtos junto',
    res.status === 200 && !db.prepare('SELECT 1 FROM groups WHERE id = ?').get(grp) && !db.prepare("SELECT 1 FROM items WHERE name = 'Batata'").get());

  res = await req('DELETE', `/api/admin/items/${created.id}`, { cookie });
  check('excluir produto', res.status === 200 && !db.prepare('SELECT 1 FROM items WHERE id = ?').get(created.id));

  /* ---------- senha ---------- */
  res = await req('POST', '/api/admin/password', { cookie, body: { current: 'errada', next: 'novasenha123' } });
  check('trocar senha com a atual errada → 400', res.status === 400);
  res = await req('POST', '/api/admin/password', { cookie, body: { current: 'senha-teste-1', next: 'curta' } });
  check('senha nova curta → 400', res.status === 400);
  const other = cookieFrom(await req('POST', '/api/admin/login', { body: { username: 'adegamm', password: 'senha-teste-1' } }));
  res = await req('POST', '/api/admin/password', { cookie, body: { current: 'senha-teste-1', next: 'novasenha123' } });
  check('trocar senha', res.status === 200);
  check('sessão que trocou continua valendo', (await req('GET', '/api/admin/me', { cookie })).status === 200);
  check('outras sessões caem', (await req('GET', '/api/admin/me', { cookie: other })).status === 401);
  res = await req('POST', '/api/admin/login', { body: { username: 'adegamm', password: 'senha-teste-1' } });
  check('senha antiga não entra mais', res.status === 401);
  res = await req('POST', '/api/admin/login', { body: { username: 'adegamm', password: 'novasenha123' } });
  check('senha nova entra', res.status === 200);

  res = await req('POST', '/api/admin/logout', { cookie });
  check('sair derruba a sessão', (await req('GET', '/api/admin/me', { cookie })).status === 401);

  /* ---------- roteamento ---------- */
  res = await req('GET', '/cardapio?x=1', { host: 'adegamm.com.br' });
  check('domínio sem www redireciona pro www',
    res.status === 301 && res.headers.get('Location') === 'https://www.adegamm.com.br/cardapio?x=1', res.headers.get('Location'));
  assetHits.length = 0;
  await req('GET', '/loja');
  await req('GET', '/loja/');
  check('/loja serve o arquivo do /cardapio', assetHits[0] === '/cardapio' && assetHits[1] === '/cardapio', assetHits);
  await req('GET', '/cardapio');
  check('/cardapio vai direto pro asset', assetHits[2] === '/cardapio');
  res = await req('GET', '/admin');
  check('/admin não é indexado', /noindex/.test(res.headers.get('X-Robots-Tag') || ''));
  res = await req('GET', '/api/nada');
  check('rota de API desconhecida → 404 JSON', res.status === 404 && (await res.json()).error);

  console.log(`\n${pass} ok, ${fail} falha(s)`);
  if (fail) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });
