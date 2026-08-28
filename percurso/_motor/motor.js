/* ============================================================================
   MOTOR DE PERCURSOS — wizard (assistente guiado) genérico
   ----------------------------------------------------------------------------
   🔑 Este arquivo NÃO sabe nada sobre a Ponte. Ele lê `window.PERCURSO`
   (definido no dados.js de cada percurso) e monta a sequência de telas.
   Para criar outro percurso: nova pasta /percurso/<nome>/ com index.html
   igual + o seu próprio dados.js.

   Decisões de UX (ago/2026):
   · UMA COISA POR TELA. O documento pede 11 áreas × 3 exercícios = 33
     descrições longas. Numa página só, isso vira um paredão que faz a pessoa
     desistir. Cada área ganha a sua tela, com progresso visível.
   · GUARDA SOZINHO e RETOMA. localStorage + "continuar de onde parei" — o
     percurso é longo de propósito, tem que sobreviver a fechar o navegador.
   · RESPEITA O PAPEL. A Elaine recomenda escrever à mão. Em vez de brigar com
     isso, cada área tem "já escrevi no papel" — a pessoa avança sem digitar e
     o progresso continua honesto.
   · LEVAR EMBORA. Botão de baixar/imprimir tudo que escreveu. Sem isso, o
     material do projeto de vida ficaria preso no navegador (e some se a
     pessoa limpar os dados) — o oposto do que o documento pede.
   ============================================================================ */

(function () {
  "use strict";

  var P = window.PERCURSO;
  if (!P) { console.error("[percurso] window.PERCURSO não encontrado"); return; }

  var LS = "percurso:" + P.id + ":v" + (P.versao || 1);
  var raiz = document.getElementById("percurso");
  /* ?capa=1 — embutido no cartaz da home: só a capa, e SEM ESCREVER NADA.
     Sem esta trava o iframe (a) abriria no passo que a pessoa parou, em vez
     da capa, e (b) salvaria i=0 por cima do progresso real dela. */
  var SO_CAPA = document.documentElement.classList.contains("so-capa");
  var VOLTAR = P.voltar || "/";   /* de onde o percurso e acessado */

  /* ---------- helpers de DOM ---------------------------------------------- */
  function h(tag, attrs) {
    var e = document.createElement(tag), k;
    attrs = attrs || {};
    for (k in attrs) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "style" && typeof v === "object") { for (var s in v) e.style[s] = v[s]; }
      else e.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) { c.forEach(function (x) { if (x) e.appendChild(typeof x === "string" ? document.createTextNode(x) : x); }); }
      else e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return e;
  }
  function paras(arr, cls) {
    return (arr || []).map(function (t) { return h("p", { class: cls || "p" }, t); });
  }

  /* ---------- estado ------------------------------------------------------ */
  function novoEstado() {
    return { v: P.versao || 1, i: 0, respostas: { fundamentos: {}, compromisso: "" }, atualizado: null };
  }
  var estado = carregar() || novoEstado();
  P.exercicios.forEach(function (ex) { if (!estado.respostas[ex.campo]) estado.respostas[ex.campo] = {}; });
  if (!estado.respostas.fundamentos) estado.respostas.fundamentos = {};

  var DIAS_EXPIRA = 60;   /* uma sessão salva "no seu ritmo" fica valendo por 60 dias;
     depois disso trata como usuário novo — sobretudo pensando em dispositivo
     compartilhado (celular de demonstração, notebook emprestado), onde um
     rascunho de meses atrás não deveria ficar assombrando quem abre depois. */
  function carregar() {
    try {
      var raw = localStorage.getItem(LS);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || s.v !== (P.versao || 1)) return null;   /* versão nova = recomeça limpo */
      if (s.atualizado && (Date.now() - s.atualizado) > DIAS_EXPIRA * 24 * 60 * 60 * 1000) return null;
      return s;
    } catch (e) { return null; }
  }
  var tSave = null;
  function salvar(agora) {
    if (SO_CAPA) return;              /* modo vitrine nunca escreve */
    clearTimeout(tSave);
    var faz = function () {
      estado.atualizado = Date.now();
      try { localStorage.setItem(LS, JSON.stringify(estado)); } catch (e) {}
      pintarSalvo();
    };
    if (agora) faz(); else tSave = setTimeout(faz, 400);
  }
  function pintarSalvo() {
    var el = document.querySelector(".pc-salvo");
    if (!el) return;
    el.textContent = "guardado";
    el.setAttribute("data-on", "1");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.removeAttribute("data-on"); }, 1400);
  }

  /* ---------- montagem da sequência de telas ------------------------------ */
  /* Cada passo: {tipo, ...}. A ordem aqui É o percurso. */
  var passos = [];
  passos.push({ tipo: "capa", cor: P.exercicios[0].cor });
  passos.push({ tipo: "carta", chave: "abertura", cor: P.exercicios[0].cor });
  passos.push({ tipo: "texto", chave: "porque", cor: P.exercicios[0].cor });
  passos.push({ tipo: "comoFunciona", cor: P.exercicios[0].cor });

  P.exercicios.forEach(function (ex, ei) {
    passos.push({ tipo: "exCapa", ex: ei, cor: ex.cor });
    passos.push({ tipo: "exEnsaio", ex: ei, cor: ex.cor });
    if (ex.ritual) passos.push({ tipo: "ritual", ex: ei, cor: ex.cor });
    if (ex.id === "ponte") {
      P.fundamentos.itens.forEach(function (f, fi) {
        passos.push({ tipo: "fundamento", ex: ei, fi: fi, cor: ex.cor });
      });
    }
    P.areas.forEach(function (a, ai) {
      passos.push({ tipo: "area", ex: ei, ai: ai, cor: ex.cor });
    });
  });

  var corFim = P.exercicios[2].cor;
  passos.push({ tipo: "sintese", cor: corFim });
  passos.push({ tipo: "texto", chave: "acoesReais", cor: corFim });
  passos.push({ tipo: "compromisso", cor: corFim });
  passos.push({ tipo: "encerramento", cor: corFim });
  passos.push({ tipo: "facilitar", cor: corFim });

  var TOTAL = passos.length;

  /* ---------- navegação --------------------------------------------------- */
  function ir(i, semRolar) {
    estado.i = Math.max(0, Math.min(TOTAL - 1, i));
    salvar(true);
    desenhar();
    if (!semRolar) window.scrollTo(0, 0);
  }
  function proximo() { ir(estado.i + 1); }
  function anterior() { ir(estado.i - 1); }

  /* ---------- progresso --------------------------------------------------- */
  function preenchidas() {
    var n = 0;
    P.exercicios.forEach(function (ex) {
      P.areas.forEach(function (a) {
        var r = estado.respostas[ex.campo][a.id];
        if (r && (String(r.t || "").trim() || r.p)) n++;
      });
    });
    return n;
  }
  function totalAreas() { return P.exercicios.length * P.areas.length; }

  /* ---------- cabeçalho --------------------------------------------------- */
  function cabecalho(passo) {
    var pct = Math.round((estado.i / (TOTAL - 1)) * 100);
    return h("header", { class: "pc-top" },
      h("a", { class: "pc-sair", href: VOLTAR, "aria-label": "Voltar ao site" }, "✕"),
      h("div", { class: "pc-id" },
        h("span", { class: "pc-nome" }, P.nome),
        h("span", { class: "pc-salvo" }, "")
      ),
      h("div", { class: "pc-barra", role: "progressbar", "aria-valuenow": pct, "aria-valuemin": "0", "aria-valuemax": "100" },
        h("i", { style: { width: pct + "%" } })
      ),
      h("button", {
        class: "pc-mapa-btn", type: "button", "aria-label": "Ver o mapa do percurso",
        onClick: function () { abrirMapa(); }
      }, "mapa")
    );
  }

  /* ---------- rodapé de navegação ----------------------------------------- */
  function rodape(rotulo, podeVoltar, aoAvancar) {
    return h("div", { class: "pc-nav" },
      podeVoltar !== false
        ? h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: anterior }, "← Voltar")
        : h("span"),
      h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: aoAvancar || proximo },
        rotulo || "Continuar", h("span", { class: "pc-seta" }, "→"))
    );
  }

  /* ---------- textarea que cresce sozinha --------------------------------- */
  function campo(valor, placeholder, aoDigitar) {
    var ta = h("textarea", {
      class: "pc-campo", rows: "4", placeholder: placeholder || "Escreva, sem pressa…",
      onInput: function () { cresce(ta); aoDigitar(ta.value); salvar(); }
    });
    ta.value = valor || "";
    setTimeout(function () { cresce(ta); }, 0);
    return ta;
  }
  function cresce(ta) {
    ta.style.height = "auto";
    ta.style.height = Math.max(120, ta.scrollHeight) + "px";
  }

  /* ============================ TELAS ===================================== */

  function telaCapa() {
    /* "tem progresso" olha SÓ o que foi ESCRITO, nunca o passo (estado.i) —
       do contrário, só de folhear as primeiras telas sem escrever nada (por
       curiosidade, ou alguém testando antes de mostrar pra outra pessoa) já
       travava a posição, e a próxima abertura "começava no meio" sem ter
       progresso de verdade pra defender (foi um relato real, ago/2026).
       Como bônus, isso também resolve por conta própria o caso de quem
       volta à capa pelo mapa (estado.i vira 0 mas o que foi escrito continua
       valendo). */
    var temAlgo = preenchidas() > 0 || String(estado.respostas.compromisso || "").trim().length > 0;
    var temProgresso = temAlgo;
    var soCapa = document.documentElement.classList.contains("so-capa");
    return h("section", { class: "pc-tela pc-capa" },
      h("video", {
        class: "pc-capa-video", autoplay: "", muted: "", loop: "", playsinline: "",
        preload: "metadata", poster: P.capa.poster
      }, h("source", { src: P.capa.video, type: "video/mp4" })),
      h("div", { class: "pc-capa-veu" }),
      h("a", { class: "pc-capa-sair", href: VOLTAR, "aria-label": "Voltar ao site" }, "✕"),
      h("div", { class: "pc-capa-in" },
        h("span", { class: "pc-capa-et" }, "Percurso"),
        h("h1", { class: "pc-capa-t" }, P.nome),
        h("p", { class: "pc-capa-sub" }, P.subtitulo),
        h("p", { class: "pc-capa-ch" }, P.capa.chamada),
        h("div", { class: "pc-capa-acoes" },
          /* embutida no cartaz (?capa=1): o botão SAI do iframe e abre o
             percurso inteiro na janela de cima — escrever 33 respostas dentro
             de um cartão que desliza seria péssimo. */
          soCapa
            ? h("a", { class: "pc-b pc-b-claro", href: location.pathname, target: "_top" },
                P.capa.entrar, h("span", { class: "pc-seta" }, "→"))
            : h("button", {
                class: "pc-b pc-b-claro", type: "button",
                onClick: function () { ir(temProgresso ? estado.i : 1); }
              }, temProgresso ? P.capa.retomar : P.capa.entrar, h("span", { class: "pc-seta" }, "→")),
          !soCapa && temProgresso ? h("button", {
            class: "pc-b pc-b-vazio", type: "button",
            onClick: function () {
              if (confirm("Recomeçar o percurso? Tudo que você escreveu será apagado.")) {
                estado = novoEstado(); P.exercicios.forEach(function (ex) { estado.respostas[ex.campo] = {}; });
                salvar(true); ir(1);
              }
            }
          }, "Recomeçar do zero") : null
        ),
        h("p", { class: "pc-capa-meta" },
          P.capa.tempo,
          (!soCapa && temProgresso) ? " · " + preenchidas() + " de " + totalAreas() + " áreas preenchidas" : ""
        ),
        h("p", { class: "pc-capa-cred" }, "por " + P.autora)
      )
    );
  }

  function telaCarta(passo) {
    var d = P[passo.chave];
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(d.etiqueta),
        h("h2", { class: "pc-t pc-t-carta" }, d.saudacao),
        paras(d.paragrafos),
        h("p", { class: "pc-assina" }, d.assinatura)
      ),
      rodape(d.avancar)
    );
  }

  function telaTexto(passo) {
    var d = P[passo.chave];
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(d.etiqueta),
        h("h2", { class: "pc-t" }, d.titulo),
        paras(d.paragrafos),
        d.destaque ? h("blockquote", { class: "pc-destaque" }, d.destaque) : null
      ),
      rodape(d.avancar)
    );
  }

  function telaComoFunciona(passo) {
    var d = P.comoFunciona;
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(d.etiqueta),
        h("h2", { class: "pc-t" }, d.titulo),
        h("div", { class: "pc-qa" },
          h("h3", null, d.objetivo.pergunta),
          h("p", { class: "p" }, d.objetivo.resposta)
        ),
        h("div", { class: "pc-qa" },
          h("h3", null, d.processo.pergunta),
          h("p", { class: "p" }, d.processo.resposta)
        ),
        h("div", { class: "pc-papel" },
          h("h3", null, d.papel.titulo),
          h("p", { class: "p" }, d.papel.texto),
          h("p", { class: "pc-nota" }, d.papel.nota)
        ),
        h("p", { class: "p" }, d.etapas),
        h("ol", { class: "pc-etapas" },
          P.exercicios.map(function (ex) {
            return h("li", { style: { "--c": ex.cor } },
              h("span", { class: "n" }, ex.numero),
              h("span", { class: "t" }, ex.titulo),
              h("span", { class: "d" }, ex.chamada)
            );
          })
        )
      ),
      rodape(d.avancar)
    );
  }

  function telaExCapa(passo) {
    var ex = P.exercicios[passo.ex];
    return h("section", { class: "pc-tela pc-excapa", style: { "--c": ex.cor } },
      cabecalho(passo),
      h("div", { class: "pc-excapa-in" },
        h("span", { class: "pc-excapa-n" }, "Exercício " + ex.numero),
        h("h2", { class: "pc-excapa-t" }, ex.titulo),
        h("p", { class: "pc-excapa-ch" }, ex.chamada),
        ex.credito ? h("p", { class: "pc-excapa-cred" }, ex.credito) : null,
        h("div", { class: "pc-nav pc-nav-centro" },
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: anterior }, "← Voltar"),
          h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: proximo }, "Começar", h("span", { class: "pc-seta" }, "→"))
        )
      )
    );
  }

  function telaExEnsaio(passo) {
    var ex = P.exercicios[passo.ex], e = ex.ensaio;
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta("Exercício " + ex.numero + " · " + ex.titulo),
        h("h2", { class: "pc-t" }, e.titulo),
        paras(e.paragrafos),
        e.provocacao ? h("div", { class: "pc-provoca" },
          h("h3", null, e.provocacao.titulo),
          h("p", { class: "p" }, e.provocacao.texto),
          h("ul", { class: "pc-lista" }, e.provocacao.itens.map(function (t) { return h("li", null, t); }))
        ) : null
      ),
      rodape("Continuar")
    );
  }

  function telaRitual(passo) {
    var ex = P.exercicios[passo.ex], r = ex.ritual;
    return pagina(passo,
      h("div", { class: "pc-bloco pc-centro" },
        h("div", { class: "pc-nota-musical" }, "♪"),
        h("h2", { class: "pc-t" }, r.titulo),
        h("p", { class: "p" }, r.texto),
        h("a", { class: "pc-b pc-b-cheio pc-b-link", href: r.link, target: "_blank", rel: "noopener" },
          r.linkRotulo, h("span", { class: "pc-seta" }, "↗"))
      ),
      rodape("Já ouvi, vamos escrever")
    );
  }

  function telaFundamento(passo) {
    var f = P.fundamentos.itens[passo.fi];
    var primeiro = passo.fi === 0;
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        primeiro ? h("div", { class: "pc-intro-fund" },
          etiqueta(P.fundamentos.etiqueta),
          h("h2", { class: "pc-t" }, P.fundamentos.titulo),
          h("p", { class: "p" }, P.fundamentos.intro)
        ) : null,
        h("div", { class: "pc-fund" },
          h("span", { class: "pc-fund-n" }, f.numero + " de " + P.fundamentos.itens.length),
          h("p", { class: "pc-fund-eb" }, f.eyebrow),
          h("h3", { class: "pc-fund-t" }, f.titulo),
          paras(f.paragrafos),
          h("ul", { class: "pc-lista" }, f.tarefas.map(function (t) { return h("li", null, t); })),
          campo(estado.respostas.fundamentos[f.id] || "", f.placeholder, function (v) {
            estado.respostas.fundamentos[f.id] = v;
          })
        )
      ),
      rodape(passo.fi === P.fundamentos.itens.length - 1 ? P.fundamentos.avancar : "Continuar")
    );
  }

  function telaArea(passo) {
    var ex = P.exercicios[passo.ex], area = P.areas[passo.ai];
    var bolsa = estado.respostas[ex.campo];
    if (!bolsa[area.id]) bolsa[area.id] = { t: "", p: false };
    var r = bolsa[area.id];

    var ta = campo(r.t, "Escreva, sem pressa…", function (v) { r.t = v; });

    var papel = h("button", {
      class: "pc-papel-tog", type: "button", "data-on": r.p ? "1" : null,
      onClick: function () {
        r.p = !r.p;
        papel.setAttribute("data-on", r.p ? "1" : "");
        if (!r.p) papel.removeAttribute("data-on");
        salvar(true);
      }
    }, h("span", { class: "pc-tick" }, "✓"), "já escrevi no papel");

    return pagina(passo,
      h("div", { class: "pc-bloco" },
        h("div", { class: "pc-area-topo" },
          h("span", { class: "pc-area-passo" }, "Área " + (passo.ai + 1) + " de " + P.areas.length),
          h("span", { class: "pc-area-ex" }, "Exercício " + ex.numero)
        ),
        h("div", { class: "pc-pontos" }, P.areas.map(function (a, i) {
          var rr = bolsa[a.id];
          var cheio = rr && (String(rr.t || "").trim() || rr.p);
          return h("button", {
            class: "pc-ponto", type: "button", title: a.nome,
            "data-on": i === passo.ai ? "1" : null, "data-cheio": cheio ? "1" : null,
            onClick: function () { ir(estado.i - passo.ai + i); }
          });
        })),
        h("h2", { class: "pc-area-nome" }, area.nome),
        h("p", { class: "pc-area-prompt" }, area[ex.campo]),
        passo.ai === 0 ? h("p", { class: "pc-nota" }, ex.instrucao) : null,
        ta,
        ex.campo === "ponte" && area.sugestoes && area.sugestoes.length
          ? h("details", { class: "pc-sugg" },
              h("summary", null, "sugestões da Elaine (" + area.sugestoes.length + ")"),
              h("ul", null, area.sugestoes.map(function (s) {
                return h("li", null,
                  h("button", {
                    type: "button", class: "pc-sugg-add", title: "Acrescentar ao meu texto",
                    onClick: function () {
                      var cur = ta.value.trim();
                      ta.value = (cur ? cur + "\n" : "") + "• " + s;
                      r.t = ta.value; cresce(ta); salvar(true); ta.focus();
                    }
                  }, "+"),
                  h("span", null, s)
                );
              }))
            )
          : null,
        papel
      ),
      rodape("Continuar")
    );
  }

  function telaSintese(passo) {
    var d = P.sintese;
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(d.etiqueta),
        h("h2", { class: "pc-t" }, d.parabens),
        h("div", { class: "pc-tres" }, P.exercicios.map(function (ex) {
          var n = 0;
          P.areas.forEach(function (a) {
            var r = estado.respostas[ex.campo][a.id];
            if (r && (String(r.t || "").trim() || r.p)) n++;
          });
          return h("div", { class: "pc-tres-c", style: { "--c": ex.cor } },
            h("span", { class: "n" }, ex.numero),
            h("span", { class: "t" }, ex.titulo),
            h("span", { class: "q" }, n + " de " + P.areas.length)
          );
        })),
        paras(d.paragrafos),
        h("div", { class: "pc-levar" },
          h("h3", null, "Leve o seu material com você"),
          h("p", { class: "pc-nota" }, "Tudo que você escreveu está guardado só neste navegador. Baixe ou imprima para não depender disso — e para poder revisitar."),
          h("div", { class: "pc-levar-b" },
            h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: baixar }, "Baixar meu material"),
            h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: imprimir }, "Imprimir / PDF")
          )
        )
      ),
      rodape(d.avancar)
    );
  }

  function telaCompromisso(passo) {
    var d = P.compromisso;
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(d.etiqueta),
        h("h2", { class: "pc-t" }, d.titulo),
        h("p", { class: "p" }, d.intro),
        h("div", { class: "pc-carta" },
          campo(estado.respostas.compromisso, d.placeholder, function (v) { estado.respostas.compromisso = v; })
        ),
        h("blockquote", { class: "pc-destaque" }, d.destaque),
        h("div", { class: "pc-levar-b" },
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: baixar }, "Baixar para enviar"),
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: imprimir }, "Imprimir / PDF")
        )
      ),
      rodape(d.avancar)
    );
  }

  function telaEncerramento(passo) {
    var d = P.encerramento;
    return pagina(passo,
      h("div", { class: "pc-bloco pc-fim" },
        etiqueta(d.etiqueta),
        h("h2", { class: "pc-t pc-t-carta" }, d.titulo),
        paras(d.paragrafos),
        h("p", { class: "pc-assina" }, d.assinatura),
        h("div", { class: "pc-levar-b" },
          h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: baixar }, "Baixar meu material"),
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: imprimir }, "Imprimir / PDF")
        )
      ),
      rodape("Orientações para conduzir com outras pessoas")
    );
  }

  function telaFacilitar(passo) {
    var d = P.facilitar;
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(d.etiqueta),
        h("h2", { class: "pc-t" }, d.titulo),
        h("p", { class: "pc-nota" }, d.intro),
        paras(d.paragrafos)
      ),
      h("div", { class: "pc-nav" },
        h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: anterior }, "← Voltar"),
        h("a", { class: "pc-b pc-b-cheio", href: VOLTAR }, "Voltar ao site", h("span", { class: "pc-seta" }, "→"))
      )
    );
  }

  /* ---------- casca de página --------------------------------------------- */
  function pagina(passo, conteudo, nav) {
    return h("section", { class: "pc-tela pc-pagina", style: { "--c": passo.cor } },
      cabecalho(passo),
      h("main", { class: "pc-corpo" }, conteudo, nav)
    );
  }
  function etiqueta(t) {
    return t ? h("div", { class: "pc-et" }, h("span", { class: "pc-et-fio" }), t) : null;
  }

  /* ---------- mapa (pular para qualquer ponto) ---------------------------- */
  function abrirMapa() {
    var itens = [];
    passos.forEach(function (p, i) {
      var rot = null;
      if (p.tipo === "exCapa") rot = { t: "Exercício " + P.exercicios[p.ex].numero + " — " + P.exercicios[p.ex].titulo, c: P.exercicios[p.ex].cor, forte: true };
      else if (p.tipo === "capa") rot = { t: "Capa", c: null };
      else if (p.tipo === "carta") rot = { t: "Boas-vindas", c: null };
      else if (p.tipo === "texto" && p.chave === "porque") rot = { t: "Antes de começar", c: null };
      else if (p.tipo === "comoFunciona") rot = { t: "Como funciona", c: null };
      else if (p.tipo === "fundamento" && p.fi === 0) rot = { t: "Os fundamentos", c: P.exercicios[p.ex].cor };
      else if (p.tipo === "sintese") rot = { t: "Síntese", c: null, forte: true };
      else if (p.tipo === "texto" && p.chave === "acoesReais") rot = { t: "Virar calendário", c: null };
      else if (p.tipo === "compromisso") rot = { t: "Compromisso", c: null };
      else if (p.tipo === "encerramento") rot = { t: "Encerramento", c: null };
      else if (p.tipo === "facilitar") rot = { t: "Conduzir com outras pessoas", c: null };
      if (rot) itens.push(h("button", {
        class: "pc-mapa-i", type: "button", "data-forte": rot.forte ? "1" : null,
        "data-on": i === estado.i ? "1" : null,
        style: rot.c ? { "--c": rot.c } : null,
        onClick: function () { fecharMapa(); ir(i); }
      }, rot.t));
    });
    var veu = h("div", { class: "pc-mapa", id: "pcMapa", onClick: function (e) { if (e.target.id === "pcMapa") fecharMapa(); } },
      h("div", { class: "pc-mapa-cx" },
        h("div", { class: "pc-mapa-top" },
          h("strong", null, "Mapa do percurso"),
          h("button", { class: "pc-mapa-x", type: "button", onClick: fecharMapa, "aria-label": "Fechar" }, "✕")
        ),
        h("p", { class: "pc-nota" }, preenchidas() + " de " + totalAreas() + " áreas preenchidas."),
        h("div", { class: "pc-mapa-l" }, itens),
        h("div", { class: "pc-levar-b" },
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: baixar }, "Baixar material"),
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: imprimir }, "Imprimir / PDF")
        )
      )
    );
    document.body.appendChild(veu);
    requestAnimationFrame(function () { veu.setAttribute("data-on", "1"); });
  }
  function fecharMapa() {
    var m = document.getElementById("pcMapa");
    if (m) m.remove();
  }
  addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMapa(); });

  /* ---------- levar embora: texto + impressão ----------------------------- */
  function montarTexto() {
    var L = [];
    L.push(P.nome.toUpperCase() + " — " + P.subtitulo);
    L.push("por " + P.autora);
    L.push("Registro pessoal · " + new Date().toLocaleDateString("pt-BR"));
    L.push("");
    P.exercicios.forEach(function (ex) {
      L.push("");
      L.push("═══════════════════════════════════════════");
      L.push("EXERCÍCIO " + ex.numero + " — " + ex.titulo.toUpperCase());
      L.push("═══════════════════════════════════════════");
      if (ex.id === "ponte") {
        L.push("");
        L.push("— FUNDAMENTOS —");
        P.fundamentos.itens.forEach(function (f) {
          var v = (estado.respostas.fundamentos[f.id] || "").trim();
          L.push("");
          L.push("[" + f.titulo + "]");
          L.push(v || "(em branco)");
        });
        L.push("");
        L.push("— AÇÕES —");
      }
      P.areas.forEach(function (a) {
        var r = estado.respostas[ex.campo][a.id] || {};
        var v = String(r.t || "").trim();
        L.push("");
        L.push("· " + a.nome.toUpperCase());
        L.push(v || (r.p ? "(escrito no papel)" : "(em branco)"));
      });
    });
    var c = (estado.respostas.compromisso || "").trim();
    L.push("");
    L.push("═══════════════════════════════════════════");
    L.push("COMPROMISSO");
    L.push("═══════════════════════════════════════════");
    L.push(c || "(em branco)");
    L.push("");
    L.push("---");
    L.push("Lembre-se: envie uma cópia deste compromisso para alguém de confiança.");
    return L.join("\n");
  }

  function baixar() {
    var txt = montarTexto();
    try {
      var blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = P.id + "-" + new Date().toISOString().slice(0, 10) + ".txt";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    } catch (e) {
      /* se o navegador bloquear o download, mostra o texto pra copiar à mão */
      var w = window.open("", "_blank");
      if (w) { w.document.write("<pre style='white-space:pre-wrap;font:14px/1.6 monospace;padding:24px'>" +
        txt.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</pre>"); w.document.close(); }
      else alert("Não consegui baixar. Use “Imprimir / PDF”.");
    }
  }

  function imprimir() {
    var alvo = document.getElementById("pcPrint");
    if (alvo) alvo.remove();
    var box = h("div", { id: "pcPrint", class: "pc-print" },
      h("h1", null, P.nome + " — " + P.subtitulo),
      h("p", { class: "sub" }, "por " + P.autora + " · registro pessoal de " + new Date().toLocaleDateString("pt-BR"))
    );
    P.exercicios.forEach(function (ex) {
      box.appendChild(h("h2", null, "Exercício " + ex.numero + " — " + ex.titulo));
      if (ex.id === "ponte") {
        box.appendChild(h("h3", null, "Fundamentos"));
        P.fundamentos.itens.forEach(function (f) {
          box.appendChild(h("h4", null, f.titulo));
          box.appendChild(h("p", null, (estado.respostas.fundamentos[f.id] || "").trim() || "—"));
        });
        box.appendChild(h("h3", null, "Ações"));
      }
      P.areas.forEach(function (a) {
        var r = estado.respostas[ex.campo][a.id] || {};
        box.appendChild(h("h4", null, a.nome));
        box.appendChild(h("p", null, String(r.t || "").trim() || (r.p ? "(escrito no papel)" : "—")));
      });
    });
    box.appendChild(h("h2", null, "Compromisso"));
    box.appendChild(h("p", null, (estado.respostas.compromisso || "").trim() || "—"));
    document.body.appendChild(box);
    window.print();
    setTimeout(function () { box.remove(); }, 800);
  }

  /* ---------- desenhar ---------------------------------------------------- */
  function desenhar() {
    if (SO_CAPA) estado.i = 0;        /* vitrine mostra sempre a capa */
    var passo = passos[estado.i];
    raiz.innerHTML = "";
    var no;
    switch (passo.tipo) {
      case "capa":          no = telaCapa(); break;
      case "carta":         no = telaCarta(passo); break;
      case "texto":         no = telaTexto(passo); break;
      case "comoFunciona":  no = telaComoFunciona(passo); break;
      case "exCapa":        no = telaExCapa(passo); break;
      case "exEnsaio":      no = telaExEnsaio(passo); break;
      case "ritual":        no = telaRitual(passo); break;
      case "fundamento":    no = telaFundamento(passo); break;
      case "area":          no = telaArea(passo); break;
      case "sintese":       no = telaSintese(passo); break;
      case "compromisso":   no = telaCompromisso(passo); break;
      case "encerramento":  no = telaEncerramento(passo); break;
      case "facilitar":     no = telaFacilitar(passo); break;
      default:              no = telaCapa();
    }
    raiz.appendChild(no);
    document.documentElement.style.setProperty("--c-atual", passo.cor || P.exercicios[0].cor);
  }

  /* guarda o que estiver digitado se a pessoa sair da página */
  addEventListener("pagehide", function () { salvar(true); });
  addEventListener("visibilitychange", function () { if (document.hidden) salvar(true); });

  desenhar();
  window.__percurso = { estado: estado, ir: ir, passos: passos, baixar: baixar };
})();
