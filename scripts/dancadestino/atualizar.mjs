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
         ⚠️ Do Linktree só entra música NOVA: se o vídeo já está na lista, ele
         é ignorado (senão o link velho de lá desfaria a escolha da engenhoca).
     node scripts/dancadestino/atualizar.mjs semana --link <youtube> --texto "Música - Intérprete" [--dry]
         MESMA ação, mas com o link e o nome digitados pelo Daniel na ENGENHOCA
         (/engenhoca/ → função → este comando no GitHub). Aqui o vídeo pode ser
         um que já está na lista: sobe pro topo e leva o selo.

   O CARTÃO da página /links/ ("Ouça no nosso tocador · <música> · <intérprete>")
   é reescrito junto, sempre que `sync` roda, a partir da faixa que tem o selo.

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
import https from 'node:https';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../..');
export const ARQ_LISTA = path.join(AQUI, 'playlist.json');
export const PAGINAS = ['radio/index.html', 'index.html', 'danca-destino/index.html'];
export const LINKTREE = 'https://linktr.ee/elainenarcizo';
export const PAGINA_LINKS = 'links/index.html';        // o cartão "Música da semana" da página /links/

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

/* ── o texto do link no Linktree → { titulo, artista } ──
   O Daniel escreve esse texto à mão toda semana e o jeito de escrever VARIOU (out/2026):
       "Música da semana: Arreuni - Doroty Marques"            ← o combinado original
       "A música desta semana é: "É" de Gonzaguinha"            ← 16/out: frase + aspas + "de"
   Em vez de obrigá-lo a decorar um formato, o robô entende os dois (e variações óbvias). Dois
   passos: (1) tira a frase de abertura ("A música desta semana é:"); (2) o que sobra pode ser
   `"Título" de Artista` (aspas + de/do/da/por) ou `Título - Artista`. Sem nenhum dos dois, o
   artista vem do canal do YouTube. */
export const ABERTURA = /^\s*(?:a\s+)?m[uú]sica\s+(?:da|desta|dessa)\s+semana(?:\s+é)?\s*[:：\-–—]?\s*/i;
export function partesDoTitulo(texto) {
  const resto = String(texto).replace(ABERTURA, '').trim();
  // `"Título" de Artista` — aspas retas OU curvas, e de/do/da/por/by antes do artista
  const q = resto.match(/^[“"'‘«]\s*(.+?)\s*[”"'’»]\s+(?:de|do|da|por|by)\s+(.+)$/i);
  if (q) return { titulo: q[1].trim(), artista: q[2].trim() };
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

/* ── o cartão "Música da semana" da página /links/ ──
   O texto dele (nome da música · intérprete) NUNCA é escrito à mão: sai da faixa com o selo, no
   playlist.json, e mora entre duas marcas de comentário que o robô reconhece:
       <small><!--semana:ID--> … <!--/semana--></small>
   Só o que está ENTRE as marcas é reescrito — o resto da página não é tocado. */
export const RE_CARTAO = /(<!--semana:)([A-Za-z0-9_-]*)(-->)([\s\S]*?)(<!--\/semana-->)/;
export const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const cartaoHtml = (faixa) => `<b>${escHtml(faixa.title)}</b> · ${escHtml(faixa.artist)}`;
/** html da página + faixa da semana → html novo; `null` se a página perdeu as marcas */
export function trocaCartao(html, faixa) {
  if (!RE_CARTAO.test(html)) return null;
  // função (não texto) no replace: um "$&" no nome da música não pode virar código de substituição
  return html.replace(RE_CARTAO, (_, ini, __, meio, ___, fim) => ini + faixa.id + meio + cartaoHtml(faixa) + fim);
}
function syncCartao({ escreve = true } = {}) {
  const faixa = leLista().find((t) => t.semana);
  if (!faixa) return false;
  const caminho = path.join(RAIZ, PAGINA_LINKS);
  if (!fs.existsSync(caminho)) return false;
  const texto = fs.readFileSync(caminho, 'utf8');
  const novo = trocaCartao(texto, faixa);
  if (novo === null) {
    // NÃO derruba a publicação: as playlists são o que importa; o cartão é o enfeite que acompanha
    const aviso = `${PAGINA_LINKS}: perdeu a marca <!--semana:…--> — o cartão da música NÃO foi atualizado (as playlists sim).`;
    console.warn(process.env.GITHUB_ACTIONS ? `::warning::${aviso}` : `⚠ ${aviso}`);
    return false;
  }
  if (novo === texto) return false;
  if (escreve) fs.writeFileSync(caminho, novo, 'utf8');
  return true;
}

export function sync({ escreve = true } = {}) {
  const lista = leLista();
  const mudou = [];
  for (const rel of PAGINAS) {
    const p = lePagina(rel);
    const novo = p.texto.replace(RE_ARRAY, (_, ini, qb, __, fim) => ini + qb + blocoDe(lista, p.indent, p.quebra) + fim);
    if (novo !== p.texto) { mudou.push(rel); if (escreve) fs.writeFileSync(p.caminho, novo, 'utf8'); }
  }
  if (syncCartao({ escreve })) mudou.push(PAGINA_LINKS);
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
  // acha o link por PALAVRAS, não por frase exata: "música" ... "semana" (acento/caixa tanto faz) E endereço do
  // YouTube. Cobre "Música da semana", "A música desta semana é", "música dessa semana"…
  const achado = links.find((l) => /musica.*semana/.test(sem(l.title)) && idDoYoutube(l.url));
  if (!achado) {
    const nomes = links.map((l) => `"${l.title}"`).join(', ');
    throw new Error(`não achei um link "Música da semana…" com endereço do YouTube no Linktree. Links que existem: ${nomes}`);
  }
  return { texto: achado.title, url: achado.url, id: idDoYoutube(achado.url) };
}

/* 🔑 O 406 DO LINKTREE (descoberto rodando no GitHub, out/2026) — o que se sabe e o que não.
   Do servidor do GitHub o Linktree responde 406 DE VEZ EM QUANDO. Medido, 6 pedidos seguidos
   por variante, mesmo servidor:
       user-agent "…dancadestino-bot" (HTTP/2) ... 200 406 200 200 200 406
       user-agent "…dancadestino-bot" (HTTP/1.1) . 406 200 200 406 200 200
       curl SEM user-agent nenhum ................ 200 200 200 200 200 200
       user-agent "curl/8.5.0" ................... 200 200 200 200 200 200
   Ou seja: é intermitente, e o que piorava era a palavra "bot" no user-agent. Antes disso eu
   tinha culpado o fetch() do Node e depois o node:https — as duas teorias estavam ERRADAS
   (as duas tentativas só tinham o mesmo user-agent "bot"; o "200" que eu vi no 1º diagnóstico
   foi sorte de uma tentativa só). Lição: com falha intermitente, UMA medição não prova nada.
   Por isso agora: curl (que se identifica sozinho como curl — honesto, sem inventar nada)
   e 5 tentativas com espera crescente. Não sei POR QUE o Linktree implica com "bot"; só sei
   que isso funcionou 12/12. Se voltar a falhar, o primeiro passo é repetir esta medição. */
function pegaPagina(url, restantes = 3) {
  return new Promise((ok, falha) => {
    const req = https.get(url, { headers: { accept: 'text/html' }, timeout: 25000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && restantes > 0) {
        res.resume();
        return ok(pegaPagina(new URL(res.headers.location, url).href, restantes - 1));
      }
      if (res.statusCode !== 200) { res.resume(); return falha(new Error(`Linktree respondeu ${res.statusCode}`)); }
      const partes = [];
      res.on('data', (d) => partes.push(d));
      res.on('end', () => ok(Buffer.concat(partes).toString('utf8')));
      res.on('error', falha);
    });
    req.on('timeout', () => req.destroy(new Error('tempo esgotado')));
    req.on('error', falha);
  });
}

function pegaComCurl(url) {
  return new Promise((ok, falha) => {
    // sem shell (execFile + lista de argumentos): nada do que vem da rede vira comando
    execFile('curl', ['-sS', '--max-time', '25', '-L', '--max-redirs', '3', '-w', '\n__HTTP__%{http_code}', url],
      { maxBuffer: 20 * 1024 * 1024, encoding: 'utf8' }, (err, out, errout) => {
        if (err && err.code === 'ENOENT') return falha(Object.assign(new Error('curl não instalado'), { semCurl: true }));
        const m = /\n__HTTP__(\d{3})\s*$/.exec(out || '');
        if (!m) return falha(new Error(`curl falhou: ${String(errout || err?.message || '').trim().slice(0, 200)}`));
        if (m[1] !== '200') return falha(new Error(`Linktree respondeu ${m[1]}`));
        ok(out.slice(0, m.index));
      });
  });
}

async function baixaLinktree() {
  let ultimo;
  for (let t = 1; t <= 5; t++) {
    try {
      try { return await pegaComCurl(LINKTREE); }
      catch (e) { if (!e.semCurl) throw e; }          // sem curl instalado → cai pra reserva
      return await pegaPagina(LINKTREE);
    } catch (e) { ultimo = e; await new Promise((ok) => setTimeout(ok, t * 3000)); }
  }
  throw new Error(`não consegui abrir o Linktree (5 tentativas): ${ultimo?.message}`);
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
    // DUAS fontes pra mesma ação: (a) a engenhoca (--link e --texto, digitados pelo Daniel) ou (b) o Linktree.
    const manual = !!(o.link || o.texto);
    let texto, id;
    if (manual) {
      id = idDoYoutube(o.link);
      if (!id) throw new Error('--link: não é um link de vídeo do YouTube (youtube.com/watch?v=… ou youtu.be/…).');
      texto = limpa(o.texto, 200);
      console.log(`Engenhoca: "${texto}"  →  vídeo ${id}`);
    } else {
      ({ texto, id } = achaMusicaDaSemana(await baixaLinktree()));
      console.log(`Linktree: "${texto}"  →  vídeo ${id}`);
    }
    const { titulo, artista } = partesDoTitulo(texto);
    const lista = leLista();
    // 🔑 O Linktree só CONTRIBUI COM MÚSICA NOVA. Sem isso, o link velho que ficou lá (o Daniel já não o atualiza
    // — usa a engenhoca) subiria de volta pro topo na sexta e DESFARIA a escolha dele.
    if (!manual && lista.some((t) => t.id === id)) {
      console.log('o vídeo do Linktree já está na lista — o Linktree só traz música NOVA. Nada a fazer.');
      saidaParaGithub({ mudou: 'false' });
      return;
    }
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
    saidaParaGithub({ mudou: 'true', mensagem: msg.replace(/[\r\n]/g, ' '), origem: manual ? 'engenhoca' : 'Linktree' });
    return;
  }

  console.log('uso: atualizar.mjs  status | sync | add <link> [--titulo X] [--artista Y] [--fim] | semana [--link L --texto "Música - Artista"] [--dry]');
  process.exit(cmd ? 2 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  principal().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
}
