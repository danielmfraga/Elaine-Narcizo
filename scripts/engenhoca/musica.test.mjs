// Testes da função da engenhoca (api/musica.js) — sem rede: fetch é trocado por um falso.
// (Fica aqui e não em api/ porque tudo em api/ vira "função" na Vercel.)
// Rodar:  node --test scripts/engenhoca/musica.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const handler = require('../../api/musica.js');
const { erros } = handler.__teste;

const OK_YT = { status: 200, ok: true, json: async () => ({ title: 'Gonzaguinha - É', author_name: 'Cidinha Tricolor' }) };
let chamadas;
function falsoFetch({ yt = OK_YT, gh = { status: 204 } } = {}) {
  chamadas = [];
  globalThis.fetch = async (url, init) => {
    chamadas.push({ url: String(url), init });
    if (String(url).includes('youtube.com/oembed')) return yt;
    if (String(url).includes('api.github.com')) return gh;
    throw new Error('fetch inesperado: ' + url);
  };
}
process.env.ENGENHOCA_ESPERA_MS = '0';      // sem os 1,5 s de espera nos testes
const SENHA = 'frase-bem-longa-de-teste-123';
function chama(corpo, { metodo = 'POST', headers = {}, env = { ENGENHOCA_SENHA: SENHA, ENGENHOCA_GH_TOKEN: 'ghp_falso' } } = {}) {
  process.env.ENGENHOCA_SENHA = env.ENGENHOCA_SENHA ?? ''; process.env.ENGENHOCA_GH_TOKEN = env.ENGENHOCA_GH_TOKEN ?? '';
  if (!env.ENGENHOCA_SENHA) delete process.env.ENGENHOCA_SENHA;
  if (!env.ENGENHOCA_GH_TOKEN) delete process.env.ENGENHOCA_GH_TOKEN;
  const req = { method: metodo, headers: { host: 'www.elainenarcizo.com.br', 'x-forwarded-for': '1.2.3.4', ...headers }, body: corpo, socket: {} };
  return new Promise((ok) => {
    const res = { hdr: {}, setHeader(k, v) { this.hdr[k] = v; }, status(c) { this.code = c; return this; }, json(o) { ok({ code: this.code, corpo: o, hdr: this.hdr }); } };
    handler(req, res);
  });
}
const BOM = { senha: SENHA, link: 'https://youtu.be/-YmuHTOUYB4?si=abc', texto: 'É - Gonzaguinha' };
test.beforeEach(() => { erros.clear(); falsoFetch(); });

test('caminho feliz: aperta o botão do robô com o link LIMPO e o texto, e devolve ok', async () => {
  const r = await chama(BOM);
  assert.equal(r.code, 200);
  assert.deepEqual({ ok: r.corpo.ok, id: r.corpo.id, texto: r.corpo.texto, canal: r.corpo.canal }, { ok: true, id: '-YmuHTOUYB4', texto: 'É - Gonzaguinha', canal: 'Cidinha Tricolor' });
  const gh = chamadas.find((c) => c.url.includes('api.github.com'));
  assert.ok(gh.url.endsWith('/repos/danielmfraga/Elaine-Narcizo/actions/workflows/musica-da-semana.yml/dispatches'));
  assert.equal(gh.init.headers.Authorization, 'Bearer ghp_falso');
  assert.deepEqual(JSON.parse(gh.init.body), { ref: 'main', inputs: { link: 'https://www.youtube.com/watch?v=-YmuHTOUYB4', texto: 'É - Gonzaguinha', simular: 'false' } });
  assert.equal(r.hdr['Cache-Control'], 'no-store');
});
test('simular:true vai como "true" (pra testar a ligação sem publicar)', async () => {
  await chama({ ...BOM, simular: true });
  assert.equal(JSON.parse(chamadas.find((c) => c.url.includes('github')).init.body).inputs.simular, 'true');
});
test('sem as variáveis na Vercel: 503 claro e NADA é chamado', async () => {
  const r = await chama(BOM, { env: {} });
  assert.equal(r.code, 503); assert.equal(r.corpo.erro, 'nao_configurada'); assert.equal(chamadas.length, 0);
});
test('só POST', async () => {
  const r = await chama(BOM, { metodo: 'GET' });
  assert.equal(r.code, 405); assert.equal(r.hdr.Allow, 'POST');
});
test('senha errada: 401, nada é chamado (nem o YouTube)', async () => {
  const r = await chama({ ...BOM, senha: 'errada' });
  assert.equal(r.code, 401); assert.equal(r.corpo.erro, 'senha'); assert.equal(chamadas.length, 0);
});
test('senha ausente ou vazia também é recusada', async () => {
  assert.equal((await chama({ link: BOM.link, texto: BOM.texto })).code, 401);
  assert.equal((await chama({ ...BOM, senha: '' })).code, 401);
});
test('5 senhas erradas seguidas bloqueiam o IP — até com a senha certa', async () => {
  for (let i = 0; i < 5; i++) assert.equal((await chama({ ...BOM, senha: 'x' + i })).code, 401);
  assert.equal((await chama(BOM)).code, 429);
});
test('acertar a senha zera a conta de erros', async () => {
  for (let i = 0; i < 4; i++) await chama({ ...BOM, senha: 'x' + i });
  assert.equal((await chama(BOM)).code, 200);
  for (let i = 0; i < 4; i++) assert.equal((await chama({ ...BOM, senha: 'y' + i })).code, 401);   // recomeçou do zero
});
test('origem de outro site é recusada (403), a própria página passa', async () => {
  assert.equal((await chama(BOM, { headers: { origin: 'https://evil.com' } })).code, 403);
  assert.equal((await chama(BOM, { headers: { origin: 'https://www.elainenarcizo.com.br' } })).code, 200);
});
test('link que não é do YouTube: 400, e o GitHub não é chamado', async () => {
  for (const link of ['https://evil.com/watch?v=-YmuHTOUYB4', 'https://www.youtube.com/playlist?list=PLx', 'oi', '']) {
    const r = await chama({ ...BOM, link });
    assert.equal(r.code, 400, link); assert.equal(r.corpo.erro, 'link');
  }
  assert.ok(!chamadas.some((c) => c.url.includes('github')));
});
test('texto vazio/curto demais: 400', async () => {
  assert.equal((await chama({ ...BOM, texto: '' })).corpo.erro, 'texto');
  assert.equal((await chama({ ...BOM, texto: ' a ' })).corpo.erro, 'texto');
});
test('texto é limpo: sem quebra de linha/controle e no máximo 160 caracteres', async () => {
  await chama({ ...BOM, texto: 'Linha1\nLinha2\r\n\t- X' + 'y'.repeat(300) });
  const t = JSON.parse(chamadas.find((c) => c.url.includes('github')).init.body).inputs.texto;
  assert.ok(!/[\n\r\t]/.test(t)); assert.ok(t.length <= 160);
});
test('texto é limpo SEM estragar letras: "s" e "n" ficam, só espaços repetidos viram um', async () => {
  await chama({ ...BOM, texto: '  Sou   do Bem  -  Naná Vasconcelos  ' });
  assert.equal(JSON.parse(chamadas.find((c) => c.url.includes('github')).init.body).inputs.texto, 'Sou do Bem - Naná Vasconcelos');
  await chama({ ...BOM, texto: 'Asa Branca\u0000 - Luiz Gonzaga' });
  assert.equal(JSON.parse(chamadas.filter((c) => c.url.includes('github')).at(-1).init.body).inputs.texto, 'Asa Branca - Luiz Gonzaga');
});
test('vídeo com embed desativado (401/403 no oEmbed): 422 com a explicação, sem acionar o robô', async () => {
  falsoFetch({ yt: { status: 401, ok: false } });
  const r = await chama(BOM);
  assert.equal(r.code, 422); assert.match(r.corpo.mensagem, /NÃO deixa tocar/);
  assert.ok(!chamadas.some((c) => c.url.includes('github')));
});
test('vídeo que não existe (404): 422', async () => {
  falsoFetch({ yt: { status: 404, ok: false } });
  assert.equal((await chama(BOM)).code, 422);
});
test('YouTube fora do ar: NÃO trava a publicação (o robô confere de novo)', async () => {
  globalThis.fetch = async (url, init) => { chamadas.push({ url: String(url), init }); if (String(url).includes('oembed')) throw new Error('rede'); return { status: 204 }; };
  assert.equal((await chama(BOM)).code, 200);
});
test('GitHub recusou o token (401): 502 com dica, sem vazar o token', async () => {
  falsoFetch({ gh: { status: 401 } });
  const r = await chama(BOM);
  assert.equal(r.code, 502); assert.match(r.corpo.mensagem, /token/i); assert.ok(!JSON.stringify(r.corpo).includes('ghp_falso'));
});
test('GitHub fora do ar (rede): 502', async () => {
  globalThis.fetch = async (url) => { if (String(url).includes('oembed')) return OK_YT; throw new Error('rede'); };
  assert.equal((await chama(BOM)).code, 502);
});
test('corpo como texto JSON também funciona; corpo lixo dá 400', async () => {
  assert.equal((await chama(JSON.stringify(BOM))).code, 200);
  assert.equal((await chama('isso não é json')).code, 400);
  assert.equal((await chama(undefined)).code, 400);
});
