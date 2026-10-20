/* ════════════════════════════════════════════════════════════════════════
   ENGENHOCA — a "porta" da música da semana                         (out/2026)
   ════════════════════════════════════════════════════════════════════════
   Única parte do site que NÃO é estática. A página /engenhoca/ manda pra cá:
       { senha, link, texto }     texto = "Música - Intérprete"
   e esta função faz TRÊS coisas, nesta ordem:
       1. confere a senha;
       2. confere o link (é um vídeo do YouTube? existe? deixa tocar fora do YouTube?);
       3. pede ao GitHub pra rodar o robô (workflow musica-da-semana.yml) com o link e o texto.
   O robô é que mexe nas playlists e na página /sintonize/, commita, e a Vercel publica.
   ESTA FUNÇÃO NUNCA ESCREVE NO SITE — só aperta o botão do robô.

   ── CONFIGURAÇÃO (Vercel → Settings → Environment Variables) ─────────────
       ENGENHOCA_SENHA     a senha que o Daniel digita na página (longa: 12+ caracteres)
       ENGENHOCA_GH_TOKEN  token do GitHub, "fine-grained", SÓ deste repositório, com UMA
                           permissão: Actions → Read and write. Com ela dá pra apertar o
                           botão do robô; NÃO dá pra ler nem alterar o código.
   Sem as duas, a função responde "ainda não foi ligada" e não faz nada.

   ── POR QUE É SEGURA O BASTANTE ─────────────────────────────────────────
     • sem a senha ninguém passa de (1);
     • com a senha, o pior caso é alguém publicar OUTRA música do YouTube que deixa tocar
       fora do YouTube (e o texto é escapado como HTML/JS no robô — título "malandro" vira
       texto, nunca código). O Daniel desfaz subindo a música certa;
     • o token não consegue mexer em arquivo nenhum do repositório, só disparar esse robô;
     • senha errada: espera 1,5 s e, depois de 5 erros seguidos, bloqueia o IP por 15 min
       (só vale enquanto a instância da função está "quente" — a defesa de verdade é a senha ser longa).
   ⚠️ Esta pasta (api/) é a ÚNICA coisa do site que depende de variáveis de ambiente. Se a
   Vercel/o GitHub forem pra outra conta (a entrega pra Elaine), refazer as DUAS variáveis
   e gerar um token novo — ver o aviso em infra-seguranca-entrega.md.
   ════════════════════════════════════════════════════════════════════════ */
'use strict';
const crypto = require('node:crypto');

const REPO = 'danielmfraga/Elaine-Narcizo';
const WORKFLOW = 'musica-da-semana.yml';
const RAMO = 'main';

/* ── as mesmas regras do robô (scripts/dancadestino/atualizar.mjs → idDoYoutube / limpa) ──
   Cópia de propósito: a pasta scripts/ não sobe pro site (.vercelignore), então a função não a enxerga. */
function idDoYoutube(url) {
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
// controle e separadores de linha do Unicode (U+2028/2029) viram espaço — montado por código de propósito
const CONTROLE = new RegExp('[\\u0000-\\u001F\\u007F' + String.fromCharCode(0x2028) + String.fromCharCode(0x2029) + ']', 'g');
const limpa = (s, max) => String(s ?? '').replace(CONTROLE, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

/* ── senha: compara pelo hash, em tempo constante (não vaza nem o tamanho) ── */
const hash = (s) => crypto.createHash('sha256').update(String(s)).digest();
const senhaConfere = (dada, certa) => crypto.timingSafeEqual(hash(dada), hash(certa));

/* ── freio contra tentativa de adivinhar a senha (por instância; veja o aviso lá em cima) ── */
const erros = new Map();                    // ip → { n, ate }
const JANELA = 15 * 60 * 1000, LIMITE = 5;
const ipDe = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '?').split(',')[0].trim();
function bloqueado(ip) {
  const e = erros.get(ip);
  if (!e) return false;
  if (Date.now() > e.ate) { erros.delete(ip); return false; }
  return e.n >= LIMITE;
}
function registraErro(ip) {
  const e = erros.get(ip);
  if (e && Date.now() <= e.ate) e.n++;
  else erros.set(ip, { n: 1, ate: Date.now() + JANELA });
}
const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));

/* ── o vídeo existe e pode ser tocado dentro do nosso tocador? (o mesmo teste do robô) ── */
async function consultaYoutube(id) {
  let r;
  try {
    r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}&format=json`,
      { signal: AbortSignal.timeout(8000) });
  } catch {
    return { ok: true, incerto: true };           // o YouTube não respondeu: o robô confere de novo, não trava aqui
  }
  if (r.status === 401 || r.status === 403)
    return { ok: false, mensagem: 'O dono desse vídeo NÃO deixa tocar fora do YouTube — no nosso tocador ele ficaria mudo. Escolha outro vídeo da mesma música.' };
  if (r.status === 404)
    return { ok: false, mensagem: 'Não achei esse vídeo (foi apagado ou está privado). Confira o link.' };
  if (!r.ok) return { ok: true, incerto: true };
  const j = await r.json().catch(() => ({}));
  return { ok: true, titulo: limpa(j.title, 120), canal: limpa(j.author_name, 80) };
}

function responde(res, status, corpo) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.status(status).json(corpo);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return responde(res, 405, { erro: 'metodo', mensagem: 'Só aceito POST.' }); }

  // só a própria página do site pode chamar (um site de fora não consegue apertar o botão por você)
  const origem = req.headers.origin;
  if (origem) {
    let h = null; try { h = new URL(origem).host; } catch { /* origem inválida */ }
    if (h !== req.headers.host) return responde(res, 403, { erro: 'origem', mensagem: 'Origem não permitida.' });
  }

  const SENHA = process.env.ENGENHOCA_SENHA, TOKEN = process.env.ENGENHOCA_GH_TOKEN;
  if (!SENHA || !TOKEN)
    return responde(res, 503, { erro: 'nao_configurada', mensagem: 'A engenhoca ainda não foi ligada: faltam a senha e o token no painel da Vercel.' });

  let corpo = req.body;
  if (typeof corpo === 'string') { try { corpo = JSON.parse(corpo); } catch { corpo = null; } }
  if (!corpo || typeof corpo !== 'object') return responde(res, 400, { erro: 'corpo', mensagem: 'Pedido malformado.' });

  // 1 ── senha
  const ip = ipDe(req);
  if (bloqueado(ip)) return responde(res, 429, { erro: 'bloqueado', mensagem: 'Muitas tentativas. Espere 15 minutos.' });
  if (!senhaConfere(corpo.senha ?? '', SENHA)) {
    registraErro(ip);
    await espera(Number(process.env.ENGENHOCA_ESPERA_MS ?? 1500));   // (a variável só existe pros testes)
    return responde(res, 401, { erro: 'senha', mensagem: 'Senha incorreta.' });
  }
  erros.delete(ip);                            // acertou: zera a conta de erros desse IP

  // 2 ── link e texto
  const id = idDoYoutube(corpo.link);
  if (!id) return responde(res, 400, { erro: 'link', mensagem: 'Isso não parece um link de vídeo do YouTube (youtube.com/watch?v=… ou youtu.be/…).' });
  const texto = limpa(corpo.texto, 160);
  if (texto.length < 3) return responde(res, 400, { erro: 'texto', mensagem: 'Escreva o nome da música e o intérprete, assim:  Música - Intérprete' });
  const yt = await consultaYoutube(id);
  if (!yt.ok) return responde(res, 422, { erro: 'video', mensagem: yt.mensagem });

  // 3 ── aperta o botão do robô
  const simular = corpo.simular === true;      // só pra testar a ligação inteira sem publicar nada
  let gh;
  try {
    gh = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'engenhoca-elaine-narcizo',
        'Content-Type': 'application/json',
      },
      // o link é refeito a partir do id (some qualquer "&list=…" ou rastreio); simular vai como texto, como o GitHub pede
      body: JSON.stringify({ ref: RAMO, inputs: { link: `https://www.youtube.com/watch?v=${id}`, texto, simular: simular ? 'true' : 'false' } }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return responde(res, 502, { erro: 'github', mensagem: 'Não consegui falar com o GitHub agora. Tente de novo em instantes.' });
  }
  if (gh.status !== 204) {
    const dica = gh.status === 401 || gh.status === 403 ? ' O token do GitHub foi recusado (venceu ou está sem a permissão "Actions: Read and write").'
      : gh.status === 404 ? ' O GitHub não achou o robô (o token enxerga esse repositório?).' : '';
    return responde(res, 502, { erro: 'github', mensagem: `O GitHub recusou o pedido (código ${gh.status}).${dica}` });
  }

  return responde(res, 200, { ok: true, id, texto, videoTitulo: yt.titulo || null, canal: yt.canal || null, simulado: simular });
};

module.exports.__teste = { idDoYoutube, limpa, senhaConfere, erros };
