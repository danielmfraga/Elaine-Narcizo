// Testes do selo "Música da semana" e da ordem (a mais nova em cima).
// Rodar:  node --test scripts/dancadestino/atualizar.selo.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { blocoDe, promoveSemana } from './atualizar.mjs';

const F = (letra, extra = {}) => ({ id: letra.padEnd(11, 'x'), title: 'T' + letra, artist: 'A' + letra, ...extra });
const ordem = (lista) => lista.map((t) => t.id[0]).join('');

test('blocoDe: só a faixa com selo ganha semana:true', () => {
  const linhas = blocoDe([F('a', { semana: true }), F('b')], '  ', '\n').split('\n');
  assert.match(linhas[0], /, semana:true \},$/);
  assert.ok(!linhas[1].includes('semana'));
});

test('promoveSemana: faixa NOVA entra no topo com o selo', () => {
  const r = promoveSemana([F('b'), F('c')], 'axxxxxxxxxx', F('a'));
  assert.equal(r.mudou, true);
  assert.equal(ordem(r.lista), 'abc');
  assert.equal(r.lista[0].semana, true);
});

test('promoveSemana: o selo SAI da anterior (nunca dois selos)', () => {
  const r = promoveSemana([F('b', { semana: true }), F('c')], 'axxxxxxxxxx', F('a'));
  assert.deepEqual(r.lista.filter((t) => t.semana).map((t) => t.id[0]), ['a']);
  assert.ok(!('semana' in r.lista[1]));
});

test('promoveSemana: já é a da semana, no topo → não muda nada (por isso pode rodar 3x na sexta)', () => {
  const lista = [F('a', { semana: true }), F('b')];
  assert.equal(promoveSemana(lista, 'axxxxxxxxxx', null).mudou, false);
});

test('promoveSemana: já estava na lista, no meio → sobe pro topo com o selo, sem duplicar', () => {
  const r = promoveSemana([F('b'), F('a'), F('c')], 'axxxxxxxxxx', null);
  assert.equal(r.mudou, true);
  assert.equal(ordem(r.lista), 'abc');
});

test('promoveSemana: título que o Daniel corrigiu à mão sobrevive', () => {
  const r = promoveSemana([F('b'), { ...F('a'), title: 'Título acertado à mão' }], 'axxxxxxxxxx', null);
  assert.equal(r.lista[0].title, 'Título acertado à mão');
});

test('promoveSemana: id fora da lista e sem faixa nova → erro, não inventa', () => {
  assert.throws(() => promoveSemana([F('b')], 'axxxxxxxxxx', null), /não está na lista/);
});
