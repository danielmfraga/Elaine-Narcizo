// Testes das VARIAÇÕES de frase do link do Linktree (o Daniel escreve à mão toda semana).
// Rodar:  node --test scripts/dancadestino/atualizar.frases.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { partesDoTitulo, achaMusicaDaSemana } from './atualizar.mjs';

test('16/out/2026: "A música desta semana é: "É" de Gonzaguinha" (o caso real)', () => {
  assert.deepEqual(partesDoTitulo('A música desta semana é: "É" de Gonzaguinha'), { titulo: 'É', artista: 'Gonzaguinha' });
});
test('aspas curvas e abertura sem os dois-pontos', () => {
  assert.deepEqual(partesDoTitulo('A música desta semana é “Sou do Bem” de Naná Vasconcelos'), { titulo: 'Sou do Bem', artista: 'Naná Vasconcelos' });
  assert.deepEqual(partesDoTitulo("A música desta semana é: 'Lambada' por Kaoma"), { titulo: 'Lambada', artista: 'Kaoma' });
});
test('título com "de" DENTRO não confunde (as aspas é que delimitam)', () => {
  assert.deepEqual(partesDoTitulo('A música desta semana é: "Tempo de Amor" de Vinicius de Moraes'), { titulo: 'Tempo de Amor', artista: 'Vinicius de Moraes' });
});
test('o formato original continua valendo', () => {
  assert.deepEqual(partesDoTitulo('Música da semana: Arreuni - Doroty Marques'), { titulo: 'Arreuni', artista: 'Doroty Marques' });
  assert.deepEqual(partesDoTitulo('Musica da semana: Guiné-Bissau, Moçambique e Angola Racional - Tim Maia'), { titulo: 'Guiné-Bissau, Moçambique e Angola Racional', artista: 'Tim Maia' });
});
test('outras aberturas: "dessa semana", "desta semana", sem "A"', () => {
  assert.deepEqual(partesDoTitulo('Música dessa semana: Rosa - Pixinguinha'), { titulo: 'Rosa', artista: 'Pixinguinha' });
  assert.deepEqual(partesDoTitulo('música desta semana é: Rosa - Pixinguinha'), { titulo: 'Rosa', artista: 'Pixinguinha' });
});
test('sem aspas e sem hífen → artista fica pro canal do YouTube', () => {
  assert.deepEqual(partesDoTitulo('A música desta semana é: Arreuni'), { titulo: 'Arreuni', artista: null });
});

const pagina = (links) => `<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps: { links } } })}</script></html>`;
const YT = 'https://www.youtube.com/watch?v=-YmuHTOUYB4&list=RD-YmuHTOUYB4&start_radio=1';

test('achaMusicaDaSemana: acha pela frase nova (e o id pode COMEÇAR com hífen)', () => {
  const r = achaMusicaDaSemana(pagina([
    { title: 'YouTube — Bate-papo com Adelaide', url: 'https://www.youtube.com/watch?v=KN8caQnpWQI' },
    { title: 'A música desta semana é: "É" de Gonzaguinha', url: YT },
    { title: 'Instagram', url: 'https://www.instagram.com/elaine.c.narcizo/' },
  ]));
  assert.equal(r.id, '-YmuHTOUYB4');
});
test('achaMusicaDaSemana: NÃO pega outro link do YouTube que não fala da música da semana', () => {
  assert.throws(() => achaMusicaDaSemana(pagina([{ title: 'YouTube — Bate-papo com Adelaide', url: 'https://www.youtube.com/watch?v=KN8caQnpWQI' }])), /não achei/);
});
test('achaMusicaDaSemana: as palavras certas mas SEM endereço do YouTube → ignora (o player só toca YouTube)', () => {
  assert.throws(() => achaMusicaDaSemana(pagina([{ title: 'A música desta semana é: "É" de Gonzaguinha', url: 'https://open.spotify.com/track/123' }])), /não achei/);
});
