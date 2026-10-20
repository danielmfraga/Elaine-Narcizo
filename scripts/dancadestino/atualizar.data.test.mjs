// Testes da DATA no selo "Música da semana" (ex.: "Música da semana · 16-10-26").
// Rodar:  node --test scripts/dancadestino/atualizar.data.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dataCurta, hojeBRT, blocoDe, promoveSemana, trocaCartao, RE_CARTAO_DATA } from './atualizar.mjs';

const SCRIPT = fileURLToPath(new URL('./atualizar.mjs', import.meta.url));
const F = (letra, extra = {}) => ({ id: letra.padEnd(11, 'x'), title: 'T' + letra, artist: 'A' + letra, ...extra });

test('dataCurta: AAAA-MM-DD vira DD-MM-AA (o jeito que o Daniel escreveu o exemplo)', () => {
  assert.equal(dataCurta('2026-10-16'), '16-10-26');
  assert.equal(dataCurta('2027-01-03'), '03-01-27');
});
test('dataCurta: o que não é data vira null (true, texto solto, formato errado)', () => {
  for (const x of [true, undefined, null, '', '16-10-26', '2026/10/16', '2026-10-16T10:00', 'abc']) assert.equal(dataCurta(x), null, String(x));
});

test('hojeBRT: usa o dia de BRASÍLIA, não o de UTC (o robô roda em UTC)', () => {
  assert.equal(hojeBRT(new Date('2026-10-16T14:00:00Z')), '2026-10-16');   // 11h BRT — o horário do robô na sexta
  assert.equal(hojeBRT(new Date('2026-10-17T01:30:00Z')), '2026-10-16');   // 22h30 BRT de sexta: em UTC já é sábado
  assert.equal(hojeBRT(new Date('2026-10-17T03:00:00Z')), '2026-10-17');   // meia-noite BRT
  assert.equal(hojeBRT(new Date('2026-12-31T23:00:00Z')), '2026-12-31');   // virada de ano
});

test('blocoDe: selo com data vira semana:\'16-10-26\'; sem data, semana:true; sem selo, nada', () => {
  const l = blocoDe([F('a', { semana: '2026-10-16' }), F('b', { semana: true }), F('c')], '', '\n').split('\n');
  assert.match(l[0], /, semana:'16-10-26' \},$/);
  assert.match(l[1], /, semana:true \},$/);
  assert.ok(!l[2].includes('semana'));
});

test('promoveSemana: a faixa nova leva a DATA; a anterior perde selo e data', () => {
  const r = promoveSemana([F('b', { semana: '2026-10-09' }), F('c')], 'axxxxxxxxxx', F('a'), '2026-10-16');
  assert.equal(r.lista[0].semana, '2026-10-16');
  assert.ok(!('semana' in r.lista[1]));
});
test('promoveSemana: sem data informada, o selo segue funcionando (true)', () => {
  assert.equal(promoveSemana([F('b')], 'axxxxxxxxxx', F('a')).lista[0].semana, true);
});
test('promoveSemana: já é a da semana → NÃO troca a data (rodar de novo no sábado não "rejuvenesce")', () => {
  const lista = [F('a', { semana: '2026-10-16' }), F('b')];
  const r = promoveSemana(lista, 'axxxxxxxxxx', null, '2026-10-17');
  assert.equal(r.mudou, false); assert.equal(r.lista[0].semana, '2026-10-16');
});
test('promoveSemana: voltar uma música ANTIGA como da semana leva a data NOVA', () => {
  const r = promoveSemana([F('b', { semana: '2026-10-16' }), F('a')], 'axxxxxxxxxx', null, '2026-10-23');
  assert.equal(r.lista[0].semana, '2026-10-23');
});

const cartao = (data = ' · 01-01-20') =>
  `<span class="sel">Música da semana<!--semana-data-->${data}<!--/semana-data--></span><small><!--semana:aaaaaaaaaaa-->x<!--/semana--></small>`;
test('trocaCartao: atualiza a data no selo amarelo junto com o nome', () => {
  const r = trocaCartao(cartao(), { id: 'bbbbbbbbbbb', title: 'Y', artist: 'Z', semana: '2026-10-16' });
  assert.ok(r.includes('Música da semana<!--semana-data--> · 16-10-26<!--/semana-data-->'), r);
  assert.ok(r.includes('<!--semana:bbbbbbbbbbb--><b>Y</b> · Z<!--/semana-->'));
});
test('trocaCartao: selo sem data (semana:true) → o espaço da data fica vazio, sem sobrar "· 01-01-20" velho', () => {
  const r = trocaCartao(cartao(), { id: 'bbbbbbbbbbb', title: 'Y', artist: 'Z', semana: true });
  assert.ok(r.includes('Música da semana<!--semana-data--><!--/semana-data-->'), r);
});
test('trocaCartao: página SEM o par da data continua funcionando (o par é opcional)', () => {
  const sem = '<small><!--semana:aaaaaaaaaaa-->x<!--/semana--></small>';
  const r = trocaCartao(sem, { id: 'bbbbbbbbbbb', title: 'Y', artist: 'Z', semana: '2026-10-16' });
  assert.equal(r, '<small><!--semana:bbbbbbbbbbb--><b>Y</b> · Z<!--/semana--></small>');
  assert.ok(!RE_CARTAO_DATA.test(r));
});
test('trocaCartao: idempotente também com a data', () => {
  const f = { id: 'bbbbbbbbbbb', title: 'Y', artist: 'Z', semana: '2026-10-16' };
  const um = trocaCartao(cartao(), f);
  assert.equal(trocaCartao(um, f), um);
});

const roda = (...args) => execFileSync(process.execPath, [SCRIPT, 'semana', '--dry', ...args], { encoding: 'utf8', stdio: 'pipe' });
test('semana --data inválida é recusada em voz alta (mesmo no --dry)', () => {
  assert.throws(() => roda('--link', 'https://youtu.be/ABCDEFGHIJK', '--texto', 'X - Y', '--data', '16-10-2026'), /--data: use AAAA-MM-DD/);
});
test('semana --data válida passa', () => {
  assert.doesNotThrow(() => roda('--link', 'https://youtu.be/ABCDEFGHIJK', '--texto', 'X - Y', '--data', '2026-10-16'));
});
