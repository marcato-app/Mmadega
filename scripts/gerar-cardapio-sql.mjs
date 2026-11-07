// Gera migrations/002_cardapio.sql a partir de assets/js/menu-data.js — a
// carga inicial do banco com o cardápio do PDF. Depois do banco no ar, quem
// edita o cardápio é o /admin; este script não precisa rodar de novo.
//
//   node scripts/gerar-cardapio-sql.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { priceToCents } from '../src/index.js';

const root = new URL('..', import.meta.url);
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(new URL('assets/js/menu-data.js', root), 'utf8'), sandbox);
const { sections } = sandbox.window.MENU_DATA;

const q = (s) => `'${String(s ?? '').replace(/'/g, "''")}'`;
const lines = ['-- Carga inicial do cardápio (gerado por scripts/gerar-cardapio-sql.mjs).', ''];
let g = 0, i = 0;

sections.forEach((s, si) => {
  lines.push(`INSERT INTO sections (id, title, sort_order) VALUES (${q(s.id)}, ${q(s.title)}, ${si});`);
  s.groups.forEach((grp, gi) => {
    const gid = `g_${String(++g).padStart(3, '0')}`;
    lines.push(`INSERT INTO groups (id, section_id, title, note, keywords, sort_order) VALUES (${q(gid)}, ${q(s.id)}, ${q(grp.title)}, ${q(grp.note)}, ${q(grp.keywords)}, ${gi});`);
    grp.items.forEach((it, ii) => {
      const cents = priceToCents(it.price);
      if (cents == null) throw new Error(`Preço inválido: ${it.name} ${it.price}`);
      lines.push(`INSERT INTO items (id, group_id, name, unit, price_cents, note, sort_order) VALUES (${q(`i_${String(++i).padStart(3, '0')}`)}, ${q(gid)}, ${q(it.name)}, ${q(it.unit)}, ${cents}, ${q(it.note)}, ${ii});`);
    });
  });
});

writeFileSync(new URL('migrations/002_cardapio.sql', root), lines.join('\n') + '\n');
console.log(`${sections.length} seções, ${g} grupos, ${i} produtos`);
