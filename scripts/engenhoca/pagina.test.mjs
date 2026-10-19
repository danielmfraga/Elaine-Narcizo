// Guardas da página /engenhoca/: o script compila, e a PRÉVIA (cópia na página) entende o texto igual ao robô.
// Rodar:  node --test scripts/engenhoca/pagina.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { partesDoTitulo, idDoYoutube } from '../dancadestino/atualizar.mjs';

const html = fs.readFileSync(fileURLToPath(new URL('../../engenhoca/index.html', import.meta.url)), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// pega o texto de uma função da página (indentada com 2 espaços, fecha em "\n  }") e a transforma numa função de verdade
const funcao = (nome) => {
  const i = script.indexOf(`  function ${nome}(`);
  assert.ok(i >= 0, `não achei function ${nome} na página`);
  const fim = script.indexOf('\n  }', i) + 4;
  return new Function(`${script.slice(i, fim)}\nreturn ${nome};`)();
};

test('o script da página compila (pega regex/aspas estragadas)', () => {
  assert.doesNotThrow(() => new Function(script));
});
test('a página impede o robô de indexar e não guarda nada no aparelho', () => {
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  assert.ok(!/localStorage|sessionStorage|document\.cookie/.test(script), 'a página guardou algo no aparelho');
});
test('a PRÉVIA entende o texto igual ao robô (partes ≡ partesDoTitulo)', () => {
  const partes = funcao('partes');
  const casos = [
    'É - Gonzaguinha', 'Arreuni - Doroty Marques', 'Sou do Bem – Naná Vasconcelos', 'Lambada — Kaoma',
    'Guiné-Bissau, Moçambique e Angola Racional - Tim Maia', 'Samba - Enredo - Fulano',
    '"É" de Gonzaguinha', '“Tempo de Amor” de Vinicius de Moraes', 'Música da semana: Arreuni - Doroty Marques',
    'A música desta semana é: "É" de Gonzaguinha', 'Só o título', '   espaços   -   por tudo   ',
  ];
  for (const c of casos) {
    const robo = partesDoTitulo(c), pag = partes(c);
    assert.deepEqual({ t: pag.t, a: pag.a }, { t: robo.titulo, a: robo.artista }, `diferem em: ${c}`);
  }
});
test('a página reconhece os mesmos links do YouTube que o robô (idDe ≡ idDoYoutube)', () => {
  const idDe = funcao('idDe');
  for (const l of ['https://youtu.be/-YmuHTOUYB4?si=abc', 'https://www.youtube.com/watch?v=KL18rlquCBk&list=RDx', 'https://music.youtube.com/watch?v=KL18rlquCBk',
    'https://m.youtube.com/watch?v=KL18rlquCBk', 'https://www.youtube.com/shorts/KL18rlquCBk', 'https://www.youtube.com/playlist?list=PLx',
    'https://evil.com/watch?v=KL18rlquCBk', 'https://youtube.com.evil.com/watch?v=KL18rlquCBk', 'não é link', ''])
    assert.equal(idDe(l), idDoYoutube(l), l);
});
