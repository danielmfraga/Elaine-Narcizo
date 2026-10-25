// Guarda da integridade do conteúdo do percurso MAPEAMENTO (percurso/mapeamento/dados.js).
// Pega erros que o motor só revelaria na hora de abrir a tela: id repetido, revisão apontando
// pra lista que não existe, fase sem cor, forma decorativa inexistente, tela longa demais…
// Rodar:  node --test scripts/percurso/mapeamento.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../../', import.meta.url));
const janela = {};
new Function('window', fs.readFileSync(RAIZ + 'percurso/mapeamento/dados.js', 'utf8'))(janela);
const P = janela.PERCURSO;
const motor = fs.readFileSync(RAIZ + 'percurso/_motor/motor-passos.js', 'utf8');
const TIPOS = ['capa', 'carta', 'leitura', 'secao', 'lista', 'pergunta', 'revisao', 'mapa', 'checkin', 'encerramento'];

test('o motor sabe desenhar todos os tipos de tela que o dados.js usa', () => {
  for (const p of P.passos) assert.ok(TIPOS.includes(p.tipo), `tipo desconhecido: ${p.tipo}`);
  for (const t of TIPOS) assert.match(motor, new RegExp(`\\b${t}:\\s*tela`), `o motor não registra a tela "${t}"`);
});
test('começa na capa e termina no encerramento', () => {
  assert.equal(P.passos[0].tipo, 'capa');
  assert.equal(P.passos.at(-1).tipo, 'encerramento');
});
test('toda tela tem uma fase que existe (cor)', () => {
  for (const [i, p] of P.passos.entries()) assert.ok(P.fases[p.fase], `passo ${i} (${p.tipo}) sem fase válida: ${p.fase}`);
  for (const [nome, f] of Object.entries(P.fases)) { assert.ok(f.cor && f.sobre && f.ct, `fase ${nome} incompleta`); }
});
test('ids de lista, pergunta e revisão são únicos e existem', () => {
  const vistos = new Set();
  for (const [i, p] of P.passos.entries()) {
    if (!['lista', 'pergunta', 'revisao'].includes(p.tipo)) continue;
    assert.ok(p.id, `passo ${i} (${p.tipo}) sem id`);
    const k = `${p.tipo}:${p.id}`; assert.ok(!vistos.has(k), `id repetido: ${k}`); vistos.add(k);
  }
});
test('toda revisão aponta pra lista(s) que existem', () => {
  const listas = new Set(P.passos.filter((p) => p.tipo === 'lista').map((p) => p.id));
  for (const p of P.passos.filter((x) => x.tipo === 'revisao'))
    for (const r of [].concat(p.ref)) assert.ok(listas.has(r), `revisão ${p.id} aponta pra lista inexistente: ${r}`);
});
test('toda lista é revista depois (a revisão é o coração do percurso)', () => {
  const revistas = new Set(P.passos.filter((p) => p.tipo === 'revisao').flatMap((p) => [].concat(p.ref)));
  for (const p of P.passos.filter((x) => x.tipo === 'lista')) assert.ok(revistas.has(p.id), `a lista "${p.id}" nunca é revista`);
});
test('as listas vêm ANTES das revisões que as usam', () => {
  const pos = (f) => P.passos.findIndex(f);
  for (const r of P.passos.filter((x) => x.tipo === 'revisao'))
    for (const ref of [].concat(r.ref)) assert.ok(pos((p) => p.tipo === 'lista' && p.id === ref) < pos((p) => p === r), `revisão ${r.id} vem antes da lista ${ref}`);
});
test('as formas decorativas citadas existem (forma e cor)', () => {
  const D = P.deco;
  for (const it of [].concat(D.capa, ...D.layouts)) {
    assert.ok(D.formas[it.forma], `forma inexistente: ${it.forma}`);
    assert.ok(D.cores[it.cor], `cor inexistente: ${it.cor}`);
  }
  for (const [k, svg] of Object.entries(D.formas)) assert.match(svg, /^<svg[\s\S]*<\/svg>$/, `forma ${k} não é um SVG inteiro`);
});
test('nenhuma tela é longa demais pra "uma coisa por tela" (limite de texto)', () => {
  for (const [i, p] of P.passos.entries()) {
    const n = JSON.stringify([p.blocos, p.paragrafos, p.intro, p.fecho, p.reflexoes]).length;
    assert.ok(n <= 3600, `passo ${i} (${p.titulo || p.pergunta || p.tipo}) tem ${n} caracteres — divida a tela`);
  }
});
test('o texto não tem os erros de digitação que já corrigimos (não voltar atrás)', () => {
  const tudo = JSON.stringify(P.passos);
  for (const ruim of ['possam possibilitem', '00emprestado', 'Serum corpo', 'estamos entendo isso', 'nos misturamos e', 'já há havia', 'respotas', 'engôdo', 'vaga- lumes', 'por aqu"'])
    assert.ok(!tudo.includes(ruim), `voltou o erro: "${ruim}"`);
});
test('a PONTE não foi tocada: o motor dela e o CSS base não mencionam o modo declarativo', () => {
  assert.ok(!/passos\.css|motor-passos/.test(fs.readFileSync(RAIZ + 'percurso/ponte/index.html', 'utf8')));
  assert.ok(!/P\.passos\b/.test(fs.readFileSync(RAIZ + 'percurso/_motor/motor.js', 'utf8')));
});
test('o index.html carrega tudo com cache-bust (?v=) — o vercel.json serve css/js como immutable', () => {
  const h = fs.readFileSync(RAIZ + 'percurso/mapeamento/index.html', 'utf8');
  for (const arq of ['dados.js', 'motor-passos.js', 'passos.css', 'tema.css']) assert.match(h, new RegExp(`${arq.replace('.', '\\.')}\\?v=\\d+`), `${arq} sem ?v=N`);
  assert.match(h, /canonical" href="https:\/\/www\./, 'canonical sem www');
});
