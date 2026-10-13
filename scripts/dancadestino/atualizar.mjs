#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════
   DançaDestino — playlist do tocador                                (out/2026)
   ════════════════════════════════════════════════════════════════════════
   A playlist existe em TRÊS páginas (cada uma tem a sua cópia do array):
       radio/index.html          →  var ytTracks=[ … ];
       index.html                →  var ddTracks=[ … ];   (miniplayer da home)
       danca-destino/index.html  →  var ddTracks=[ … ];
   Mexer nelas à mão é o jeito de uma sair diferente da outra. Por isso a
   FONTE ÚNICA é `playlist.json` (aqui do lado) e este script reescreve o
   array das três — só o array: o resto de cada página não é tocado, byte a
   byte (inclusive CRLF).

   USO (a partir da raiz do projeto):
     node scripts/dancadestino/atualizar.mjs status
         confere se as 3 páginas batem com o playlist.json
     node scripts/dancadestino/atualizar.mjs add <link-do-youtube> [--titulo "…"] [--artista "…"] [--fim]
         põe uma faixa no TOPO da lista (ou no fim, com --fim) e sincroniza
     node scripts/dancadestino/atualizar.mjs sync
         reescreve as 3 páginas a partir do playlist.json
     node scripts/dancadestino/atualizar.mjs semana [--dry]
         lê o Linktree da Elaine, acha "Música da semana: …", põe no TOPO e
         dá a ela o selo "Música da semana" (tirando o selo da anterior).
         É o que o robô chama toda sexta. Roda quantas vezes quiser: se ela
         já é a primeira da lista, com o selo, não faz nada.

   ORDEM DA LISTA: a mais nova SEMPRE em cima — a lista é lida de cima pra
   baixo como um calendário que anda pra trás. O selo ("semana:true" no
   playlist.json) existe em UMA faixa só: a música da semana atual.

   🔑 Título e artista saem do TEXTO DO LINKTREE ("Música da semana: Arreuni
   - Doroty Marques" → título "Arreuni", artista "Doroty Marques"). Só se o
   texto não trouxer " - " é que entra o nome do canal do YouTube.
   ⚠️ Esse formato é um combinado entre o Daniel e o robô. Se o link mudar de
   nome ("Música da semana" sumir), o robô FALHA em voz alta — não adivinha.
   ════════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../..');
export const ARQ_LISTA = path.join(AQUI, 'playlist.json');
export const PAGINAS = ['radio/index.html', 'index.html', 'danca-destino/index.html'];
export const LINKTREE = 'https://linktr.ee/elainenarcizo';

// separadores de linha do Unicode (U+2028/2029): num texto JS eles QUEBRAM a linha. Montado por código de propósito.
const SEP_LINHA_UNICODE = new RegExp('[' + String.fromCharCode(0x2028) + String.fromCharCode(0x2029) + ']', 'g');

/* ── texto seguro pra dentro de um '…' de JavaScript dentro de um <script> ── */
export function esc(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/</g, '\\x3C')            // nunca deixa nascer um "</script>"
    .replace(SEP_LINHA_UNICODE, ' ');
}
export function limpa(s, max) {
  return String(s ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')   // sem quebra de linha nem controle
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/* ── link do YouTube → id do vídeo (11 caracteres) ── */
export function idDoYoutube(url) {
  let u;
  try { u = new URL(String(url).trim()); } catch { return null; }
  const host = u.hostname.replace(/^(www|m|music)\./, '');
  let id = null;
  if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com') {
    id = u.searchParams.get('v');
    if (!id) { const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/); if (m) id = m[1]; }
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

/* ── "Música da semana: Arreuni - Doroty Marques" → { titulo, artista } ── */
export function partesDoTitulo(texto) {
  const resto = String(texto).replace(/^\s*m[uú]sica\s+da\s+semana\s*[:：\-–—]?\s*/i, '').trim();
  // separador = " - " / " – " / " — " COM espaços (o hífen de "Guiné-Bissau" não conta);
  // vale o ÚLTIMO, porque o nome do artista raramente tem hífen e o da música às vezes tem
  const i = Math.max(resto.lastIndexOf(' - '), resto.lastIndexOf(' – '), resto.lastIndexOf(' — '));
  if (i > 0) return { titulo: resto.slice(0, i).trim(), artista: resto.slice(i + 3).trim() };
  return { titulo: resto, artista: null };
}
export const artistaDoCanal = (nome) =>
  limpa(nome, 80).replace(/\s*-\s*Topic$/i, '').replace(/VEVO$/i, '').replace(/\s+(Oficial|Official)$/i, '').trim();

/* ── ler / escrever o array dentro de cada página ── */
const RE_ARRAY = /(var (?:yt|dd)Tracks=\[)(\r?\n)([\s\S]*?)(\r?\n[ \t]*\];)/;

function lePagina(rel) {
  const caminho = path.join(RAIZ, rel);
  const texto = fs.readFileSync(caminho, 'utf8');
  const m = texto.match(RE_ARRAY);
  if (!m) throw new Error(`${rel}: não achei "var ytTracks=[" / "var ddTracks=[" — a página mudou de forma?`);
  if (texto.match(new RegExp(RE_ARRAY.source, 'g')).length !== 1)
    throw new Error(`${rel}: achei MAIS de um array de playlist; não sei qual trocar.`);
  const faixas = new Function(`return [${m[3]}];`)();   // arquivo nosso, de confiança
  const indent = (m[3].match(/^[ \t]*/) || [''])[0];
  return { caminho, texto, m, faixas, indent, quebra: m[2] };
}

export function blocoDe(faixas, indent, quebra) {
  return faixas
    // `semana:true` só existe na faixa que leva o selo "Música da semana" (no máximo UMA)
    .map((t, i) => `${indent}{ id:'${esc(t.id)}', title:'${esc(t.title)}', artist:'${esc(t.artist)}'${t.semana ? ', semana:true' : ''} }${i < faixas.length - 1 ? ',' : ''}`)
    .join(quebra);
}

export function leLista() {
  const lista = JSON.parse(fs.readFileSync(ARQ_LISTA, 'utf8'));
  const vistos = new Set();
  lista.forEach((t, i) => {
    if (!/^[A-Za-z0-9_-]{11}$/.test(t.id || '')) throw new Error(`playlist.json #${i + 1}: id inválido (${t.id})`);
    if (!t.title || !t.artist) throw new Error(`playlist.json #${i + 1} (${t.id}): falta título ou artista`);
    if (vistos.has(t.id)) throw new Error(`playlist.json: id repetido (${t.id})`);
    vistos.add(t.id);
  });
  if (lista.filter((t) => t.semana).length > 1) throw new Error("playlist.json: mais de uma faixa com o selo da semana.");
  return lista;
}
const salvaLista = (lista) => fs.writeFileSync(ARQ_LISTA, JSON.stringify(lista, null, 2) + '\n', 'utf8');

export function sync({ escreve = true } = {}) {
  const lista = leLista();
  const mudou = [];
  for (const rel of PAGINAS) {
    const p = lePagina(rel);
    const novo = p.texto.replace(RE_ARRAY, (_, ini, qb, __, fim) => ini + qb + blocoDe(lista, p.indent, p.quebra) + fim);
    if (novo !== p.texto) { mudou.push(rel); if (escreve) fs.writeFileSync(p.caminho, novo, 'utf8'); }
  }
  return mudou;
}

/* ── YouTube: o vídeo existe e pode ser tocado dentro de outro site? ── */
export async function consultaYoutube(id) {
  const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}&format=json`,
    { signal: AbortSignal.timeout(20000) });
  if (r.status === 401 || r.status === 403)
    throw new Error(`o dono do vídeo ${id} NÃO permite tocar fora do YouTube (embed desativado) — o player ficaria mudo.`);
  if (r.status === 404) throw new Error(`o vídeo ${id} não existe ou é privado.`);
  if (!r.ok) throw new Error(`o YouTube respondeu ${r.status} ao conferir o vídeo ${id}.`);
  const j = await r.json();
  return { titulo: limpa(j.title, 120), canal: artistaDoCanal(j.author_name) };
}

/* ── pôr uma faixa na lista (a regra única, usada por add e por semana) ── */
export async function adiciona({ id, titulo, artista, fim = false }) {
  const lista = leLista();
  const ja = lista.findIndex((t) => t.id === id);
  if (ja >= 0) return { novo: false, faixa: lista[ja] };
  const yt = await consultaYoutube(id);                    // falha aqui = nada é escrito
  const faixa = {
    id,
    title: limpa(titulo || yt.titulo, 120),
    artist: limpa(artista || yt.canal, 80),
  };
  if (!faixa.title || !faixa.artist) throw new Error(`faltou título ou artista para ${id}; passe --titulo e --artista.`);
  if (fim) lista.push(faixa); else lista.unshift(faixa);
  salvaLista(lista);
  return { novo: true, faixa };
}

/* ── a MÚSICA DA SEMANA: vai pro topo e leva o selo; o selo sai de quem tinha ──
   Pura (sem rede, sem arquivo) pra poder ser testada. `nova` = a faixa pronta,
   só necessária quando o id ainda não está na lista. */
export function promoveSemana(lista, id, nova) {
  const i = lista.findIndex((t) => t.id === id);
  const comSelo = lista.filter((t) => t.semana);
  if (i === 0 && comSelo.length === 1) return { mudou: false, lista, faixa: lista[0] };   // já é a da semana
  const faixa = i >= 0 ? lista[i] : nova;
  if (!faixa) throw new Error(`promoveSemana: o vídeo ${id} não está na lista e não veio a faixa nova.`);
  const resto = lista.filter((t) => t.id !== id).map(({ semana, ...t }) => t);   // tira o selo de todo mundo
  const { semana: _antigo, ...limpa_ } = faixa;
  return { mudou: true, lista: [{ ...limpa_, semana: true }, ...resto], faixa: limpa_ };
}

/* ── Linktree ── */
export function achaMusicaDaSemana(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('o Linktree não trouxe o bloco de dados (__NEXT_DATA__) — o formato da página pode ter mudado.');
  const links = JSON.parse(m[1])?.props?.pageProps?.links;
  if (!Array.isArray(links)) throw new Error('o Linktree não trouxe a lista de links — o formato da página pode ter mudado.');
  const sem = (s) => String(s || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  const achado = links.find((l) => /musica\s+da\s+semana/.test(sem(l.title)) && idDoYoutube(l.url));
  if (!achado) {
    const nomes = links.map((l) => `"${l.title}"`).join(', ');
    throw new Error(`não achei um link "Música da semana…" com endereço do YouTube no Linktree. Links que existem: ${nomes}`);
  }
  return { texto: achado.title, url: achado.url, id: idDoYoutube(achado.url) };
}

async function baixaLinktree() {
  let ultimo;
  for (let t = 1; t <= 3; t++) {
    try {
      const r = await fetch(LINKTREE, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; dancadestino-bot)' }, signal: AbortSignal.timeout(25000) });
      if (!r.ok) throw new Error(`Linktree respondeu ${r.status}`);
      return await r.text();
    } catch (e) { ultimo = e; await new Promise((ok) => setTimeout(ok, t * 4000)); }
  }
  throw new Error(`não consegui abrir o Linktree (3 tentativas): ${ultimo?.message}`);
}

function saidaParaGithub(chaves) {
  if (process.env.GITHUB_OUTPUT)
    fs.appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(chaves).map(([k, v]) => `${k}=${v}\n`).join(''));
}

/* ── comandos ── */
function opcoes(args) {
  const o = { _: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const k = args[i].slice(2);
      o[k] = ['fim', 'dry'].includes(k) ? true : args[++i];
    } else o._.push(args[i]);
  }
  return o;
}

async function principal() {
  const [cmd, ...resto] = process.argv.slice(2);
  const o = opcoes(resto);

  if (cmd === 'status') {
    const lista = leLista();
    let ok = true;
    for (const rel of PAGINAS) {
      const ids = lePagina(rel).faixas.map((t) => t.id).join();
      const bate = ids === lista.map((t) => t.id).join();
      ok = ok && bate;
      console.log(`${bate ? '✓' : '✗'} ${rel.padEnd(26)} ${bate ? 'bate' : 'DIFERENTE'} (${lePagina(rel).faixas.length} faixas)`);
    }
    console.log(`  playlist.json            ${lista.length} faixas`);
    process.exit(ok ? 0 : 1);
  }

  if (cmd === 'sync') {
    const mudou = sync();
    console.log(mudou.length ? `reescrevi: ${mudou.join(', ')}` : 'nada a fazer — as 3 páginas já batem.');
    return;
  }

  if (cmd === 'add') {
    const id = idDoYoutube(o._[0]);
    if (!id) throw new Error('passe um link do YouTube válido (youtube.com/watch?v=… ou youtu.be/…).');
    const r = await adiciona({ id, titulo: o.titulo, artista: o.artista, fim: !!o.fim });
    if (!r.novo) { console.log(`já estava na lista: ${r.faixa.title} — ${r.faixa.artist}`); return; }
    sync();
    console.log(`✓ ${r.faixa.title} — ${r.faixa.artist}  (${o.fim ? 'no fim' : 'no topo'})`);
    return;
  }

  if (cmd === 'semana') {
    const { texto, id } = achaMusicaDaSemana(await baixaLinktree());
    const { titulo, artista } = partesDoTitulo(texto);
    console.log(`Linktree: "${texto}"  →  vídeo ${id}`);
    const lista = leLista();
    if (o.dry) {
      const e = lista.findIndex((t) => t.id === id);
      console.log(e === 0 && lista[0].semana ? '[dry] já é a música da semana — não faria nada.'
        : e >= 0 ? `[dry] já está na lista (#${e + 1}); subiria pro topo com o selo "Música da semana".`
        : `[dry] entraria no topo, com o selo: "${titulo}" — "${artista ?? '(nome do canal)'}"`);
      return;
    }
    let nova = null;
    if (!lista.some((t) => t.id === id)) {                 // só confere no YouTube se for faixa nova
      const yt = await consultaYoutube(id);                // falha aqui = nada é escrito
      nova = { id, title: limpa(titulo || yt.titulo, 120), artist: limpa(artista || yt.canal, 80) };
      if (!nova.title || !nova.artist) throw new Error(`faltou título ou artista para ${id}.`);
    }
    const r = promoveSemana(lista, id, nova);
    if (!r.mudou) {
      console.log(`já é a música da semana (${r.faixa.title}). Nada a fazer.`);
      saidaParaGithub({ mudou: 'false' });
      return;
    }
    salvaLista(r.lista);
    const mudou = sync();
    const msg = `DançaDestino: música da semana — ${r.faixa.title} (${r.faixa.artist})`;
    console.log(`✓ ${msg}\n  páginas: ${mudou.join(', ')}`);
    saidaParaGithub({ mudou: 'true', mensagem: msg.replace(/[\r\n]/g, ' ') });
    return;
  }

  console.log('uso: atualizar.mjs  status | sync | add <link> [--titulo X] [--artista Y] [--fim] | semana [--dry]');
  process.exit(cmd ? 2 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  principal().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
}
