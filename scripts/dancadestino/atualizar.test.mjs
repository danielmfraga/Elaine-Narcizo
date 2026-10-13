// Testes do robô da música da semana.  Rodar:  node --test scripts/dancadestino/
import test from 'node:test';
import assert from 'node:assert/strict';
import { idDoYoutube, partesDoTitulo, artistaDoCanal, esc, limpa, blocoDe, achaMusicaDaSemana, promoveSemana } from './atualizar.mjs';

test('idDoYoutube: aceita as formas de link que aparecem de verdade', () => {
  const id = 'KL18rlquCBk';
  assert.equal(idDoYoutube('https://www.youtube.com/watch?v=KL18rlquCBk&list=RDGMEMAi--jfGOs'), id); // o do Linktree (mix)
  assert.equal(idDoYoutube('https://youtu.be/KL18rlquCBk?si=abc'), id);
  assert.equal(idDoYoutube('https://music.youtube.com/watch?v=KL18rlquCBk'), id);
  assert.equal(idDoYoutube('https://m.youtube.com/watch?v=KL18rlquCBk'), id);
  assert.equal(idDoYoutube('https://www.youtube.com/shorts/KL18rlquCBk'), id);
});
test('idDoYoutube: recusa o que não é vídeo', () => {
  assert.equal(idDoYoutube('https://www.youtube.com/playlist?list=PLWJeYn75sV3E'), null); // playlist pura, sem vídeo
  assert.equal(idDoYoutube('https://www.instagram.com/elaine.c.narcizo/'), null);
  assert.equal(idDoYoutube('https://evil.com/watch?v=KL18rlquCBk'), null);               // domínio que só imita
  assert.equal(idDoYoutube('https://youtube.com.evil.com/watch?v=KL18rlquCBk'), null);
  assert.equal(idDoYoutube('https://www.youtube.com/watch?v=curto'), null);
  assert.equal(idDoYoutube('não é link'), null);
  assert.equal(idDoYoutube(''), null);
});

test('partesDoTitulo: o caso real', () => {
  assert.deepEqual(partesDoTitulo('Musica da semana: Arreuni - Doroty Marques'), { titulo: 'Arreuni', artista: 'Doroty Marques' });
});
test('partesDoTitulo: com acento, sem acento, maiúscula, travessão', () => {
  assert.deepEqual(partesDoTitulo('Música da Semana: Sou do Bem - Naná Vasconcelos'), { titulo: 'Sou do Bem', artista: 'Naná Vasconcelos' });
  assert.deepEqual(partesDoTitulo('MÚSICA DA SEMANA – Lambada — Kaoma'), { titulo: 'Lambada', artista: 'Kaoma' });
});
test('partesDoTitulo: hífen SEM espaço não separa (Guiné-Bissau)', () => {
  assert.deepEqual(partesDoTitulo('Música da semana: Guiné-Bissau, Moçambique e Angola Racional - Tim Maia'),
    { titulo: 'Guiné-Bissau, Moçambique e Angola Racional', artista: 'Tim Maia' });
});
test('partesDoTitulo: sem separador → artista fica pro canal do YouTube', () => {
  assert.deepEqual(partesDoTitulo('Música da semana: Arreuni'), { titulo: 'Arreuni', artista: null });
});
test('partesDoTitulo: música com " - " no nome vence o ÚLTIMO separador', () => {
  assert.deepEqual(partesDoTitulo('Música da semana: Samba - Enredo - Fulano'), { titulo: 'Samba - Enredo', artista: 'Fulano' });
});

test('artistaDoCanal: limpa o sufixo que o YouTube põe', () => {
  assert.equal(artistaDoCanal('Doroty Marques - Topic'), 'Doroty Marques');
  assert.equal(artistaDoCanal('Anitta VEVO'), 'Anitta');
  assert.equal(artistaDoCanal('Fulano Oficial'), 'Fulano');
});

test('esc: aspas, barra e & (& passa cru, como nas faixas de hoje)', () => {
  assert.equal(esc("Samba d'água"), "Samba d\\'água");
  assert.equal(esc('Bob Marley & The Wailers'), 'Bob Marley & The Wailers');
  assert.equal(esc('a\\b'), 'a\\\\b');
});
test('esc: NUNCA deixa passar </script> nem quebra de string', () => {
  const ruim = "x'</script><script>alert(1)</script>";
  const s = esc(ruim);
  assert.ok(!s.includes('<'), 'sobrou "<"');
  assert.ok(!/(^|[^\\])'/.test(s), 'sobrou aspa simples sem escape');
});
test('limpa: tira quebra de linha, controle e limita o tamanho', () => {
  assert.equal(limpa('a\nb\r\nc\t d', 50), 'a b c d');
  assert.equal(limpa('x'.repeat(300), 120).length, 120);
  assert.equal(limpa(null, 10), '');
});

test('blocoDe: mesmo formato das faixas de hoje, última sem vírgula, respeita indentação e CRLF', () => {
  const f = [{ id: 'aaaaaaaaaaa', title: "d'água", artist: 'X' }, { id: 'bbbbbbbbbbb', title: 'Y', artist: 'Z & W' }];
  assert.equal(blocoDe(f, '      ', '\r\n'),
    "      { id:'aaaaaaaaaaa', title:'d\\'água', artist:'X' },\r\n      { id:'bbbbbbbbbbb', title:'Y', artist:'Z & W' }");
});

const pagina = (links) => `<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps: { links } } })}</script></html>`;
test('achaMusicaDaSemana: acha o link certo no meio dos outros', () => {
  const r = achaMusicaDaSemana(pagina([
    { title: 'YouTube — Bate-papo com Adelaide', url: 'https://www.youtube.com/watch?v=KN8caQnpWQI' },
    { title: 'Musica da semana: Arreuni - Doroty Marques', url: 'https://www.youtube.com/watch?v=KL18rlquCBk&list=RDGMEMAi--jfGOs' },
    { title: 'Instagram', url: 'https://www.instagram.com/elaine.c.narcizo/' },
  ]));
  assert.equal(r.id, 'KL18rlquCBk');
});
test('achaMusicaDaSemana: FALHA em voz alta (não adivinha) quando o combinado quebra', () => {
  // renomeou o link
  assert.throws(() => achaMusicaDaSemana(pagina([{ title: 'Playlist da sexta', url: 'https://www.youtube.com/watch?v=KL18rlquCBk' }])), /não achei/);
  // trocou o endereço por Spotify (o player só toca YouTube)
  assert.throws(() => achaMusicaDaSemana(pagina([{ title: 'Música da semana: X - Y', url: 'https://open.spotify.com/track/123' }])), /não achei/);
  // o Linktree mudou o formato da página
  assert.throws(() => achaMusicaDaSemana('<html>sem dados</html>'), /formato/);
  assert.throws(() => achaMusicaDaSemana(`<script id="__NEXT_DATA__" type="application/json">{"props":{}}</script>`), /formato/);
});
