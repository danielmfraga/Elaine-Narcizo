// Testes do cartão "Música da semana" da página /sintonize/ e do modo manual (engenhoca).
// Rodar:  node --test scripts/dancadestino/atualizar.cartao.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { trocaCartao, cartaoHtml, escHtml, RE_CARTAO } from './atualizar.mjs';

const SCRIPT = fileURLToPath(new URL('./atualizar.mjs', import.meta.url));
const pagina = (miolo = '<b>Velha</b> · Fulano', id = 'aaaaaaaaaaa') =>
  `<a><span class="txt">Ouça<small><!--semana:${id}-->${miolo}<!--/semana--></small></span></a>\r\n<p>resto</p>`;

test('cartaoHtml: nome da música em negrito, intérprete depois do ponto-médio', () => {
  assert.equal(cartaoHtml({ title: 'É', artist: 'Gonzaguinha' }), '<b>É</b> · Gonzaguinha');
});
test('escHtml: nada do nome vira HTML (título vem de gente digitando)', () => {
  assert.equal(escHtml('<script>"x" & y</script>'), '&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;');
  const r = trocaCartao(pagina(), { id: 'bbbbbbbbbbb', title: '<img src=x onerror=alert(1)>', artist: 'A & B' });
  assert.ok(!r.includes('<img'), 'sobrou uma tag crua');
  assert.ok(r.includes('A &amp; B'));
});
test('trocaCartao: troca o id e o texto, e só isso (o resto da página fica byte a byte, inclusive CRLF)', () => {
  const antes = pagina();
  const depois = trocaCartao(antes, { id: '-YmuHTOUYB4', title: 'É', artist: 'Gonzaguinha' });
  assert.equal(depois, pagina('<b>É</b> · Gonzaguinha', '-YmuHTOUYB4'));
  assert.ok(depois.endsWith('\r\n<p>resto</p>'));
});
test('trocaCartao: idempotente (rodar 2× dá o mesmo)', () => {
  const f = { id: 'bbbbbbbbbbb', title: 'Y', artist: 'Z' };
  const um = trocaCartao(pagina(), f);
  assert.equal(trocaCartao(um, f), um);
});
test('trocaCartao: "$&" e "$1" no nome da música NÃO viram código de substituição', () => {
  const r = trocaCartao(pagina(), { id: 'bbbbbbbbbbb', title: "Cifrão $& e $1", artist: 'X' });
  assert.ok(r.includes('<b>Cifrão $&amp; e $1</b>'), r);
});
test('trocaCartao: página sem as marcas → null (o robô avisa em vez de adivinhar)', () => {
  assert.equal(trocaCartao('<small>DançaDestino · toda sexta</small>', { id: 'bbbbbbbbbbb', title: 'Y', artist: 'Z' }), null);
});
test('RE_CARTAO: aceita id que começa com hífen (o vídeo -YmuHTOUYB4 é real)', () => {
  assert.ok(RE_CARTAO.test('<!--semana:-YmuHTOUYB4-->x<!--/semana-->'));
});

/* ── o modo manual, ponta a ponta no processo (só --dry: não toca em arquivo nem em rede) ── */
const roda = (...args) => execFileSync(process.execPath, [SCRIPT, 'semana', '--dry', ...args], { encoding: 'utf8' });
test('semana --link --texto (dry): vídeo novo entraria no topo, com o nome que o Daniel digitou', () => {
  const s = roda('--link', 'https://youtu.be/ABCDEFGHIJK', '--texto', 'Asa Branca - Luiz Gonzaga');
  assert.match(s, /Engenhoca: "Asa Branca - Luiz Gonzaga"/);
  assert.match(s, /entraria no topo, com o selo: "Asa Branca" — "Luiz Gonzaga"/);
});
test('semana --link --texto (dry): aceita "Título" de Artista (como o Daniel já escreve no Linktree)', () => {
  const s = roda('--link', 'https://youtu.be/ABCDEFGHIJK', '--texto', '"Tempo de Amor" de Vinicius de Moraes');
  assert.match(s, /"Tempo de Amor" — "Vinicius de Moraes"/);
});
test('semana --link (dry): o vídeo que JÁ é a música da semana não faz nada', () => {
  const s = roda('--link', 'https://www.youtube.com/watch?v=-YmuHTOUYB4', '--texto', 'É - Gonzaguinha');
  assert.match(s, /já é a música da semana/);
});
test('semana --link (dry): mesmo vídeo com o nome CORRIGIDO → mudaria o nome (é como se conserta um erro de digitação)', () => {
  const s = roda('--link', 'https://www.youtube.com/watch?v=-YmuHTOUYB4', '--texto', 'É - Gonzaguinha (ao vivo)');
  assert.ok(s.includes('o nome mudaria pra "É" — "Gonzaguinha (ao vivo)"'), s);
});
test('semana --link: link que não é do YouTube é recusado em voz alta', () => {
  assert.throws(() => roda('--link', 'https://evil.com/watch?v=ABCDEFGHIJK', '--texto', 'X - Y'), /não é um link de vídeo do YouTube/);
});
