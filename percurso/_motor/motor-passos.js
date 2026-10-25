/* ============================================================================
   MOTOR DE PERCURSOS — modo DECLARATIVO ("passos")                (out/2026)
   ----------------------------------------------------------------------------
   🔑 Este é o motor GENÉRICO DE VERDADE. O `motor.js` (da PONTE) é genérico só no
   conteúdo: o montador de telas dele é a estrutura da Ponte (3 exercícios × 11
   áreas). Aqui o percurso inteiro é uma LISTA de telas tipadas — `P.passos` — no
   dados.js; este arquivo só sabe desenhar cada TIPO de tela.
   ⚠️ Não mexe no motor.js nem no percurso.css: a PONTE segue byte a byte igual.
   Este motor reaproveita as classes `pc-*` do percurso.css e acrescenta as suas
   em passos.css.

   TIPOS DE TELA (cada passo é { tipo, fase, rotulo?, ... }):
     capa        capa do percurso (sem vídeo; formas orgânicas)
     carta       carta de boas-vindas: etiqueta, saudacao, paragrafos[], assinatura
     leitura     texto: etiqueta, titulo, blocos[]  (ver BLOCOS abaixo)
     secao       abertura de uma parte (tela inteira na cor da fase)
     lista       uma pergunta cuja resposta é uma LISTA de "sujeitos" (chips)
     pergunta    uma pergunta de resposta livre (um campo de texto)
     revisao     volta a listas já escritas: mostra a lista, reflexões, notas e
                 deixa ACRESCENTAR itens novos (fica separado do que veio antes)
     mapa        painel com todas as listas (modo "inicio" ou "final")
     checkin     "está tudo bem? continuemos?" com opção de pausa
     encerramento  texto final + levar embora + (opcional) `convite`
   BLOCOS de `leitura`: "texto" | {p} | {h3} | {destaque} | {citacao,autoria?} |
     {lista:[]} | {numeros:[]} | {poema:[[versos],…]} | {def:[[termo,texto],…]} |
     {nota} | {pergunta}
   FASES (P.fases): cor de cada parte — {cor, sobre (cor do texto sobre ela), ct}.

   Decisões (as mesmas do motor da PONTE, que deram certo):
     · UMA COISA POR TELA. · GUARDA SOZINHO e RETOMA (localStorage, 60 dias).
     · RESPEITA O PAPEL ("já fiz no papel"). · LEVAR EMBORA (baixar .txt/imprimir).
     · 🔒 PRIVACIDADE: o que a pessoa escreve NUNCA sai do aparelho.
     · ?capa=1 (vitrine): só a capa e NÃO escreve nada (embutido em cartaz).
   Acessibilidade (lacunas que o motor da Ponte tem): todo campo tem rótulo, a
   troca de tela move o foco pro título, e remover item tem nome acessível.
   ============================================================================ */
(function () {
  "use strict";

  var P = window.PERCURSO;
  if (!P || !Array.isArray(P.passos)) { console.error("[percurso] window.PERCURSO.passos não encontrado"); return; }

  var LS = "percurso:" + P.id + ":v" + (P.versao || 1);
  var raiz = document.getElementById("percurso");
  var SO_CAPA = document.documentElement.classList.contains("so-capa");
  var VOLTAR = P.voltar || "/";
  var passos = P.passos, TOTAL = passos.length;
  var DIAS_EXPIRA = 60, MAX_ITEM = 80, MAX_ITENS = 60;

  /* ---------- helpers de DOM ---------------------------------------------- */
  function junta(e, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { junta(e, x); }); return; }
    e.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  }
  function h(tag, attrs) {
    var e = document.createElement(tag), k;
    attrs = attrs || {};
    for (k in attrs) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;            /* só SVG estático do dados.js (confiável) */
      else if (k === "text") e.textContent = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v);
    }
    for (var i = 2; i < arguments.length; i++) junta(e, arguments[i]);
    return e;
  }
  var ids = function (ref) { return Array.isArray(ref) ? ref : [ref]; };
  var norm = function (s) { return String(s).replace(/\s+/g, " ").trim(); };

  /* ---------- estado ------------------------------------------------------ */
  function novoEstado() { return { v: P.versao || 1, i: 0, listas: {}, perguntas: {}, revisoes: {}, atualizado: null }; }
  function carregar() {
    try {
      var raw = localStorage.getItem(LS);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || s.v !== (P.versao || 1)) return null;     /* versão nova = recomeça limpo */
      if (s.atualizado && (Date.now() - s.atualizado) > DIAS_EXPIRA * 24 * 60 * 60 * 1000) return null;
      return s;
    } catch (e) { return null; }
  }
  var estado = carregar() || novoEstado();
  ["listas", "perguntas", "revisoes"].forEach(function (k) { if (!estado[k]) estado[k] = {}; });

  var tSave = null;
  function salvar(agora) {
    if (SO_CAPA) return;                                  /* vitrine nunca escreve */
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

  /* acessores que criam o registro só quando preciso */
  function dadosLista(id) { return estado.listas[id] || (estado.listas[id] = { itens: [], novos: [], p: false }); }
  function dadosPergunta(id) { return estado.perguntas[id] || (estado.perguntas[id] = { t: "", p: false }); }
  function dadosRevisao(id) { return estado.revisoes[id] || (estado.revisoes[id] = { t: "" }); }
  function passoDaLista(id) { for (var i = 0; i < passos.length; i++) if (passos[i].tipo === "lista" && passos[i].id === id) return passos[i]; return null; }

  /* ---------- progresso --------------------------------------------------- */
  var TIPOS_RESPOSTA = { lista: 1, pergunta: 1, revisao: 1 };
  function respondeu(p) {
    var r;
    if (p.tipo === "lista") { r = estado.listas[p.id]; return !!r && (r.itens.length > 0 || !!r.p); }
    if (p.tipo === "pergunta") { r = estado.perguntas[p.id]; return !!r && (norm(r.t || "").length > 0 || !!r.p); }
    if (p.tipo === "revisao") {
      r = estado.revisoes[p.id];
      var novos = ids(p.ref).some(function (id) { return estado.listas[id] && estado.listas[id].novos.length > 0; });
      return novos || (!!r && norm(r.t || "").length > 0);
    }
    return false;
  }
  var ETAPAS = passos.filter(function (p) { return TIPOS_RESPOSTA[p.tipo]; });
  function preenchidas() { return ETAPAS.filter(respondeu).length; }
  /* "já começou" = ESCREVEU algo (nunca só a posição — bug real da Ponte, ago/2026) */
  function temProgresso() { return preenchidas() > 0; }

  /* ---------- navegação --------------------------------------------------- */
  function ir(i, semRolar) {
    estado.i = Math.max(0, Math.min(TOTAL - 1, i));
    salvar(true);
    desenhar();
    if (!semRolar) window.scrollTo(0, 0);
  }
  function proximo() { ir(estado.i + 1); }
  function anterior() { ir(estado.i - 1); }

  /* ---------- casca de página --------------------------------------------- */
  function fase(p) { return (P.fases && P.fases[p.fase]) || { cor: "#E5264F", sobre: "#fff", ct: "#E5264F" }; }
  function estiloFase(p) { var f = fase(p); return "--c:" + f.cor + ";--sobre:" + (f.sobre || "#fff") + ";--ct:" + (f.ct || f.cor); }

  function deco(passo) {
    var D = P.deco;
    if (!D || !D.layouts || !D.layouts.length) return null;   /* a capa tem composição própria (D.capa) */
    var L = (passo.tipo === "capa" && D.capa) ? D.capa : D.layouts[passos.indexOf(passo) % D.layouts.length];
    return h("div", { class: "pc-deco-g", "aria-hidden": "true" }, L.map(function (it) {
      return h("div", { class: "pc-deco pc-deco-" + it.pos, style: "color:" + D.cores[it.cor], html: D.formas[it.forma] });
    }));
  }

  function cabecalho() {
    var pct = Math.round((estado.i / (TOTAL - 1)) * 100);
    return h("header", { class: "pc-top" },
      h("a", { class: "pc-sair", href: VOLTAR, "aria-label": "Voltar ao site" }, "✕"),
      h("div", { class: "pc-id" },
        h("span", { class: "pc-nome" }, P.nome),
        h("span", { class: "pc-salvo", role: "status" }, "")
      ),
      h("div", { class: "pc-barra", role: "progressbar", "aria-label": "Progresso do percurso", "aria-valuenow": pct, "aria-valuemin": "0", "aria-valuemax": "100" },
        h("i", { style: "width:" + pct + "%" })
      ),
      h("button", { class: "pc-mapa-btn", type: "button", "aria-label": "Ver o mapa do percurso", onClick: abrirMapa }, "mapa")
    );
  }
  function rodape(rotulo, podeVoltar, aoAvancar) {
    return h("div", { class: "pc-nav" },
      podeVoltar !== false
        ? h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: anterior }, "← Voltar")
        : h("span"),
      h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: aoAvancar || proximo },
        rotulo || "Continuar", h("span", { class: "pc-seta" }, "→"))
    );
  }
  function pagina(passo, conteudo, nav) {
    return h("section", { class: "pc-tela pc-pagina", style: estiloFase(passo) },
      deco(passo), cabecalho(), h("main", { class: "pc-corpo" }, conteudo, nav));
  }
  function etiqueta(t) { return t ? h("div", { class: "pc-et" }, h("span", { class: "pc-et-fio" }), t) : null; }

  /* ---------- campos ------------------------------------------------------ */
  function cresce(ta) { ta.style.height = "auto"; ta.style.height = Math.max(120, ta.scrollHeight) + "px"; }
  function campo(valor, rotulo, placeholder, aoDigitar) {
    var ta = h("textarea", {
      class: "pc-campo", rows: "4", "aria-label": rotulo, placeholder: placeholder || "Escreva, sem pressa…",
      onInput: function () { cresce(ta); aoDigitar(ta.value); salvar(); }
    });
    ta.value = valor || "";
    setTimeout(function () { cresce(ta); }, 0);
    return ta;
  }
  function papelToggle(obj) {
    var b = h("button", {
      class: "pc-papel-tog", type: "button", "aria-pressed": obj.p ? "true" : "false", "data-on": obj.p ? "1" : null,
      onClick: function () {
        obj.p = !obj.p;
        if (obj.p) b.setAttribute("data-on", "1"); else b.removeAttribute("data-on");
        b.setAttribute("aria-pressed", obj.p ? "true" : "false");
        salvar(true);
      }
    }, h("span", { class: "pc-tick" }, "✓"), "já fiz no papel");
    return b;
  }

  /* itens de lista: acrescenta com limpeza (ignora repetido, limita tamanho e quantidade) */
  function acrescenta(arr, texto, tambem) {
    var feito = false;
    String(texto).split(/[\n;]+/).forEach(function (t) {
      t = norm(t).slice(0, MAX_ITEM);
      if (!t || arr.length >= MAX_ITENS) return;
      var igual = function (x) { return x.toLowerCase() === t.toLowerCase(); };
      if (arr.some(igual) || (tambem && tambem.some(igual))) return;
      arr.push(t); feito = true;
    });
    return feito;
  }
  function entradaItem(rotulo, placeholder, aoAcrescentar) {
    var inp = h("input", {
      class: "pc-in", type: "text", maxlength: String(MAX_ITEM), autocomplete: "off",
      "aria-label": rotulo, placeholder: placeholder,
      onKeydown: function (e) { if (e.key === "Enter") { e.preventDefault(); add(); } }
    });
    function add() { if (aoAcrescentar(inp.value)) { inp.value = ""; } inp.focus(); }
    return h("div", { class: "pc-add" }, inp,
      h("button", { class: "pc-b pc-b-cheio pc-add-b", type: "button", onClick: add }, "Adicionar"));
  }
  function chips(arr, classe, aoRemover) {
    return h("ul", { class: "pc-chips", "aria-label": "Itens da lista" }, arr.map(function (t, i) {
      return h("li", { class: "pc-chip " + (classe || ""), "data-fixo": aoRemover ? null : "1" }, h("span", null, t),
        aoRemover ? h("button", { class: "pc-chip-x", type: "button", "aria-label": "Remover " + t, onClick: function () { aoRemover(i); } }, "×") : null);
    }));
  }

  /* pontinhos de um grupo de passos (ex.: as 8 perguntas) */
  function pontos(passo) {
    if (!passo.grupo) return null;
    var idx = [];
    passos.forEach(function (p, i) { if (p.grupo === passo.grupo) idx.push(i); });
    return h("div", { class: "pc-pontos" }, idx.map(function (i) {
      var p = passos[i];
      return h("button", {
        class: "pc-ponto", type: "button", title: p.curto || "", "aria-label": (p.curto || "Etapa") + (respondeu(p) ? " (preenchida)" : ""),
        "data-on": i === estado.i ? "1" : null, "data-cheio": respondeu(p) ? "1" : null,
        onClick: function () { ir(i); }
      });
    }));
  }
  function topoGrupo(passo, rotulo) {
    if (!passo.grupo) return null;
    var idx = [], pos = 0;
    passos.forEach(function (p, i) { if (p.grupo === passo.grupo) { idx.push(i); if (i === estado.i) pos = idx.length; } });
    return [h("div", { class: "pc-area-topo" },
      h("span", { class: "pc-area-passo" }, (rotulo || "Pergunta") + " " + pos + " de " + idx.length),
      h("span", { class: "pc-area-ex" }, passo.nomeGrupo || "")), pontos(passo)];
  }

  /* ============================ BLOCOS ===================================== */
  function blocos(arr) {
    return (arr || []).map(function (b) {
      if (typeof b === "string") return h("p", { class: "p" }, b);
      if (b.p) return h("p", { class: "p" }, b.p);
      if (b.h3) return h("h3", { class: "pc-h3" }, b.h3);
      if (b.destaque) return h("blockquote", { class: "pc-destaque" }, b.destaque);
      if (b.pergunta) return h("p", { class: "pc-grande" }, b.pergunta);
      if (b.nota) return h("p", { class: "pc-nota pc-nota-b" }, b.nota);
      if (b.citacao) return h("blockquote", { class: "pc-citacao" },
        (Array.isArray(b.citacao) ? b.citacao : [b.citacao]).map(function (t) { return h("p", null, t); }),
        b.autoria ? h("cite", null, b.autoria) : null);
      if (b.lista) return h("ul", { class: "pc-lista" }, b.lista.map(function (t) { return h("li", null, t); }));
      if (b.numeros) return h("ol", { class: "pc-numeros" }, b.numeros.map(function (t) { return h("li", null, t); }));
      if (b.poema) return h("div", { class: "pc-poema" }, b.poema.map(function (est) {
        return h("p", { class: "pc-estrofe" }, est.map(function (v, i) { return [i ? h("br") : null, v]; }));
      }));
      if (b.def) return h("dl", { class: "pc-def" }, b.def.map(function (d) { return [h("dt", null, d[0]), h("dd", null, d[1])]; }));
      return null;
    });
  }

  /* ============================ TELAS ===================================== */
  function telaCapa(passo) {
    var C = P.capa || {}, tem = temProgresso();
    return h("section", { class: "pc-tela pc-capa pc-capa-clara", style: estiloFase(passo) },
      deco(passo),
      h("a", { class: "pc-capa-sair", href: VOLTAR, "aria-label": "Voltar ao site" }, "✕"),
      h("div", { class: "pc-capa-in" },
        h("span", { class: "pc-capa-et" }, "Percurso"),
        h("h1", { class: "pc-capa-t" }, P.nome),
        P.subtitulo ? h("p", { class: "pc-capa-sub" }, P.subtitulo) : null,
        C.chamada ? h("p", { class: "pc-capa-ch" }, C.chamada) : null,
        h("div", { class: "pc-capa-acoes" },
          /* embutida no cartaz (?capa=1): o botão SAI do iframe e abre o percurso inteiro na janela de cima */
          SO_CAPA
            ? h("a", { class: "pc-b pc-b-cheio", href: location.pathname, target: "_top" }, C.entrar || "Começar", h("span", { class: "pc-seta" }, "→"))
            : h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: function () { ir(tem ? Math.max(1, estado.i) : 1); } },
                tem ? (C.retomar || "Continuar de onde parei") : (C.entrar || "Começar"), h("span", { class: "pc-seta" }, "→")),
          !SO_CAPA && tem ? h("button", {
            class: "pc-b pc-b-vazio", type: "button",
            onClick: function () {
              if (confirm("Recomeçar o percurso? Tudo que você escreveu será apagado deste aparelho.")) {
                estado = novoEstado(); salvar(true); ir(1);
              }
            }
          }, "Recomeçar do zero") : null
        ),
        h("p", { class: "pc-capa-meta" }, C.tempo || "",
          (!SO_CAPA && tem) ? " · " + preenchidas() + " de " + ETAPAS.length + " etapas preenchidas" : ""),
        h("p", { class: "pc-capa-cred" }, "por " + P.autora)
      )
    );
  }

  function telaCarta(passo) {
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(passo.etiqueta),
        h("h2", { class: "pc-t pc-t-carta" }, passo.saudacao),
        blocos(passo.paragrafos),
        passo.assinatura ? h("p", { class: "pc-assina" }, passo.assinatura) : null
      ),
      rodape(passo.avancar));
  }

  function telaLeitura(passo) {
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(passo.etiqueta),
        passo.titulo ? h("h2", { class: "pc-t" }, passo.titulo) : null,
        blocos(passo.blocos)
      ),
      rodape(passo.avancar));
  }

  function telaSecao(passo) {
    return h("section", { class: "pc-tela pc-excapa pc-secao", style: estiloFase(passo) },
      deco(passo), cabecalho(),
      h("div", { class: "pc-excapa-in" },
        h("span", { class: "pc-excapa-n" }, passo.numero || ""),
        h("h2", { class: "pc-excapa-t" }, passo.titulo),
        passo.chamada ? h("p", { class: "pc-excapa-ch" }, passo.chamada) : null,
        h("div", { class: "pc-nav pc-nav-centro" },
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: anterior }, "← Voltar"),
          h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: proximo }, passo.avancar || "Começar", h("span", { class: "pc-seta" }, "→"))
        )
      )
    );
  }

  function telaLista(passo) {
    var L = dadosLista(passo.id), area = h("div", { class: "pc-chips-area" });
    function pinta() {
      area.innerHTML = "";
      area.appendChild(L.itens.length
        ? chips(L.itens, "", function (i) { L.itens.splice(i, 1); salvar(true); pinta(); })
        : h("p", { class: "pc-nota pc-vazio" }, "Nada por aqui ainda. Escreva acima, um de cada vez."));
    }
    pinta();
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        topoGrupo(passo, "Pergunta"),
        h("h2", { class: "pc-pergunta" }, passo.pergunta),
        passo.dica ? h("p", { class: "pc-nota pc-dica" }, passo.dica) : null,
        entradaItem(passo.pergunta, passo.placeholder || "Escreva e aperte Enter", function (t) {
          var f = acrescenta(L.itens, t); if (f) { salvar(true); pinta(); } return f;
        }),
        area,
        papelToggle(L)
      ),
      rodape("Continuar"));
  }

  function telaPergunta(passo) {
    var Q = dadosPergunta(passo.id);
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        topoGrupo(passo, "Pergunta"),
        passo.nota ? h("p", { class: "pc-regra" }, passo.nota) : null,
        h("h2", { class: "pc-pergunta" + (passo.enunciado.length > 90 ? " pc-pergunta-longa" : "") }, passo.enunciado),
        campo(Q.t, passo.enunciado, passo.placeholder, function (v) { Q.t = v; }),
        papelToggle(Q)
      ),
      rodape("Continuar"));
  }

  function telaRevisao(passo) {
    var refs = ids(passo.ref), R = dadosRevisao(passo.id), reflexoes = passo.reflexoes || [];
    /* a lista que a pessoa escreveu antes (só leitura) */
    var antigas = refs.map(function (rid) {
      var def = passoDaLista(rid) || {}, L = dadosLista(rid);
      return h("div", { class: "pc-rev-lista" },
        refs.length > 1 ? h("h3", { class: "pc-h3" }, def.curto || rid) : null,
        h("p", { class: "pc-rotulo" }, "A sua lista até aqui"),
        L.itens.length
          ? chips(L.itens, "pc-chip-fixo")
          : h("p", { class: "pc-nota" }, L.p ? "Você fez esta lista no papel. Releia-a lá." : "Você não listou ninguém aqui — tudo bem. Comece agora, logo abaixo."));
    });
    /* onde ela ACRESCENTA (fica separado, em outra cor, do que veio antes) */
    var novas = refs.map(function (rid) {
      var def = passoDaLista(rid) || {}, L = dadosLista(rid), area = h("div", { class: "pc-chips-area" });
      function pinta() {
        area.innerHTML = "";
        if (L.novos.length) area.appendChild(chips(L.novos, "pc-chip-novo", function (i) { L.novos.splice(i, 1); salvar(true); pinta(); }));
      }
      pinta();
      return h("div", { class: "pc-rev-novos" },
        h("p", { class: "pc-rotulo" }, refs.length > 1 ? "Quem mais apareceu em “" + (def.curto || rid) + "”?" : "Quem mais apareceu? Acrescente à lista"),
        entradaItem("Acrescentar à lista: " + (def.curto || rid), "Um novo sujeito, e Enter", function (t) {
          var f = acrescenta(L.novos, t, L.itens); if (f) { salvar(true); pinta(); } return f;
        }),
        area);
    });
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        topoGrupo(passo, "Revisão"),
        h("h2", { class: "pc-pergunta" }, passo.pergunta),
        blocos(passo.intro),
        antigas,
        reflexoes.length ? h("div", { class: "pc-refl" },
          h("p", { class: "pc-rotulo" }, "Para pensar, uma de cada vez"),
          h("ol", { class: "pc-numeros" }, reflexoes.map(function (t) { return h("li", null, t); }))) : null,
        reflexoes.length ? [
          h("p", { class: "pc-rotulo" }, "Suas anotações (opcional)"),
          campo(R.t, "Suas anotações sobre: " + passo.pergunta, "O que apareceu pra você? Escreva aqui ou no papel.", function (v) { R.t = v; })
        ] : null,
        novas,
        passo.fecho && passo.fecho.length ? h("div", { class: "pc-fecho" },
          h("p", { class: "pc-rotulo" }, "Para ler com calma"), blocos(passo.fecho)) : null
      ),
      rodape("Continuar"));
  }

  function telaMapa(passo) {
    var listas = passos.filter(function (p) { return p.tipo === "lista"; });
    var antes = 0, depois = 0, papel = 0;
    var cartoes = listas.map(function (d) {
      var L = estado.listas[d.id] || { itens: [], novos: [], p: false };
      antes += L.itens.length; depois += L.itens.length + L.novos.length; if (L.p) papel++;
      var todos = L.itens.length + L.novos.length;
      return h("li", { class: "pc-mapa-card" },
        h("h3", { class: "pc-h3" }, d.curto || d.pergunta),
        todos
          ? h("ul", { class: "pc-chips" },
              L.itens.map(function (t) { return h("li", { class: "pc-chip pc-chip-fixo", "data-fixo": "1" }, h("span", null, t)); }),
              L.novos.map(function (t) { return h("li", { class: "pc-chip pc-chip-novo", "data-fixo": "1" }, h("span", null, t)); }))
          : h("p", { class: "pc-nota" }, L.p ? "Feita no papel." : "—"));
    });
    var final = passo.modo === "final";
    return pagina(passo,
      h("div", { class: "pc-bloco" },
        etiqueta(passo.etiqueta),
        h("h2", { class: "pc-t" }, passo.titulo),
        blocos(passo.blocos),
        final && depois > 0 ? h("div", { class: "pc-crescer" },
          h("span", { class: "n" }, String(antes)), h("span", { class: "seta" }, "→"), h("span", { class: "n n2" }, String(depois)),
          h("span", { class: "t" }, "sujeitos no seu mapa: eram " + antes + " no começo, agora são " + depois + (depois > antes ? " — " + (depois - antes) + (depois - antes === 1 ? " a mais." : " a mais.") : "."))) : null,
        papel ? h("p", { class: "pc-nota" }, "Algumas listas você fez no papel — elas não aparecem aqui.") : null,
        h("ul", { class: "pc-mapa-grade" }, cartoes),
        final ? h("div", { class: "pc-levar" },
          h("h3", null, "Leve o seu mapa com você"),
          h("p", { class: "pc-nota" }, "Tudo que você escreveu está guardado só neste aparelho. Baixe ou imprima, para não depender disso."),
          h("div", { class: "pc-levar-b" },
            h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: baixar }, "Baixar meu mapa"),
            h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: imprimir }, "Imprimir / PDF"))) : null
      ),
      rodape(passo.avancar));
  }

  function telaCheckin(passo) {
    var msg = h("div", { class: "pc-pausa", hidden: "hidden" },
      h("p", { class: "p" }, passo.pausa),
      h("div", { class: "pc-levar-b" },
        h("a", { class: "pc-b pc-b-ghost", href: VOLTAR }, "Voltar ao site"),
        h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: proximo }, "Prefiro continuar agora", h("span", { class: "pc-seta" }, "→"))));
    return pagina(passo,
      h("div", { class: "pc-bloco pc-centro" },
        h("h2", { class: "pc-t" }, passo.titulo),
        blocos(passo.blocos),
        h("div", { class: "pc-levar-b pc-centro-b" },
          h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: proximo }, passo.continuar || "Continuemos", h("span", { class: "pc-seta" }, "→")),
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: function () { msg.removeAttribute("hidden"); msg.scrollIntoView({ block: "nearest" }); } }, passo.pararRotulo || "Preciso de uma pausa")),
        msg),
      h("div", { class: "pc-nav" }, h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: anterior }, "← Voltar"), h("span")));
  }

  function telaEncerramento(passo) {
    var cv = passo.convite;
    return pagina(passo,
      h("div", { class: "pc-bloco pc-fim" },
        etiqueta(passo.etiqueta),
        h("h2", { class: "pc-t pc-t-carta" }, passo.titulo),
        blocos(passo.paragrafos),
        passo.assinatura ? h("p", { class: "pc-assina" }, passo.assinatura) : null,
        h("div", { class: "pc-levar-b" },
          h("button", { class: "pc-b pc-b-cheio", type: "button", onClick: baixar }, "Baixar meu mapa"),
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: imprimir }, "Imprimir / PDF")),
        /* convite opcional (ex.: pra uma oficina): só aparece se o dados.js trouxer `convite` */
        cv ? h("aside", { class: "pc-convite" },
          h("h3", null, cv.titulo), h("p", { class: "p" }, cv.texto),
          h("a", { class: "pc-b pc-b-cheio", href: cv.href, target: cv.externo ? "_blank" : null, rel: cv.externo ? "noopener" : null }, cv.rotulo, h("span", { class: "pc-seta" }, "→"))) : null
      ),
      h("div", { class: "pc-nav" },
        h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: anterior }, "← Voltar"),
        h("a", { class: "pc-b pc-b-ghost", href: VOLTAR }, "Voltar ao site")));
  }

  /* ---------- mapa (pular para qualquer ponto) ---------------------------- */
  function abrirMapa() {
    var itens = [];
    passos.forEach(function (p, i) {
      if (!p.rotulo) return;
      var f = fase(p);
      itens.push(h("button", {
        class: "pc-mapa-i", type: "button", "data-forte": p.tipo === "secao" ? "1" : null, "data-on": i === estado.i ? "1" : null,
        style: p.tipo === "secao" ? "--c:" + (f.ct || f.cor) : null,
        onClick: function () { fecharMapa(); ir(i); }
      }, p.rotulo));
    });
    var veu = h("div", { class: "pc-mapa", id: "pcMapa", role: "dialog", "aria-label": "Mapa do percurso", onClick: function (e) { if (e.target.id === "pcMapa") fecharMapa(); } },
      h("div", { class: "pc-mapa-cx" },
        h("div", { class: "pc-mapa-top" },
          h("strong", null, "Mapa do percurso"),
          h("button", { class: "pc-mapa-x", type: "button", onClick: fecharMapa, "aria-label": "Fechar" }, "✕")),
        h("p", { class: "pc-nota" }, preenchidas() + " de " + ETAPAS.length + " etapas preenchidas."),
        h("div", { class: "pc-mapa-l" }, itens),
        h("div", { class: "pc-levar-b" },
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: baixar }, "Baixar material"),
          h("button", { class: "pc-b pc-b-ghost", type: "button", onClick: imprimir }, "Imprimir / PDF"))));
    document.body.appendChild(veu);
    requestAnimationFrame(function () { veu.setAttribute("data-on", "1"); });
  }
  function fecharMapa() { var m = document.getElementById("pcMapa"); if (m) m.remove(); }
  addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMapa(); });

  /* ---------- levar embora: texto + impressão ----------------------------- */
  /* percorre os passos de resposta e devolve blocos neutros {tit, sub, linhas[]} usados pelo .txt e pela impressão */
  function secoesDeSaida() {
    var out = [], atual = null;
    passos.forEach(function (p) {
      if (p.tipo === "secao") { atual = { parte: p.titulo, itens: [] }; out.push(atual); return; }
      if (!TIPOS_RESPOSTA[p.tipo]) return;
      if (!atual) { atual = { parte: "", itens: [] }; out.push(atual); }
      var it = null;
      if (p.tipo === "lista") {
        var L = estado.listas[p.id] || { itens: [], novos: [], p: false };
        it = { tit: p.curto || p.pergunta, linhas: [] };
        if (L.itens.length) it.linhas.push(L.itens.join("; "));
        if (L.p && !L.itens.length) it.linhas.push("(feita no papel)");
        if (L.novos.length) it.linhas.push("Acrescentados na revisão: " + L.novos.join("; "));
      } else if (p.tipo === "pergunta") {
        var Q = estado.perguntas[p.id] || { t: "", p: false };
        it = { tit: p.enunciado, linhas: [norm(Q.t) ? Q.t.trim() : (Q.p ? "(escrito no papel)" : "")] };
      } else if (p.tipo === "revisao") {
        var R = estado.revisoes[p.id] || { t: "" };
        it = { tit: "Revisão — " + p.pergunta, linhas: [] };
        if (norm(R.t || "")) it.linhas.push("Anotações: " + R.t.trim());
      }
      if (it) { it.linhas = it.linhas.filter(Boolean); atual.itens.push(it); }
    });
    return out;
  }
  function montarTexto() {
    var L = [];
    L.push(P.nome.toUpperCase() + (P.subtitulo ? " — " + P.subtitulo : ""));
    L.push("por " + P.autora);
    L.push("Registro pessoal · " + new Date().toLocaleDateString("pt-BR"));
    secoesDeSaida().forEach(function (s) {
      L.push(""); L.push("═══════════════════════════════════════════");
      L.push((s.parte || "").toUpperCase());
      L.push("═══════════════════════════════════════════");
      s.itens.forEach(function (it) { L.push(""); L.push("· " + it.tit); L.push(it.linhas.length ? it.linhas.join("\n") : "(em branco)"); });
    });
    L.push(""); L.push("---");
    L.push("Este material foi guardado só no seu aparelho. Guarde esta cópia com carinho.");
    return L.join("\n");
  }
  function baixar() {
    var txt = montarTexto();
    try {
      var blob = new Blob([txt], { type: "text/plain;charset=utf-8" }), url = URL.createObjectURL(blob);
      var a = document.createElement("a"); a.href = url; a.download = P.id + "-" + new Date().toISOString().slice(0, 10) + ".txt";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    } catch (e) {
      var w = window.open("", "_blank");
      if (w) { w.document.write("<pre style='white-space:pre-wrap;font:14px/1.6 monospace;padding:24px'>" + txt.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</pre>"); w.document.close(); }
      else alert("Não consegui baixar. Use “Imprimir / PDF”.");
    }
  }
  function imprimir() {
    var alvo = document.getElementById("pcPrint"); if (alvo) alvo.remove();
    var box = h("div", { id: "pcPrint", class: "pc-print" },
      h("h1", null, P.nome + (P.subtitulo ? " — " + P.subtitulo : "")),
      h("p", { class: "sub" }, "por " + P.autora + " · registro pessoal de " + new Date().toLocaleDateString("pt-BR")));
    secoesDeSaida().forEach(function (s) {
      box.appendChild(h("h2", null, s.parte));
      s.itens.forEach(function (it) {
        box.appendChild(h("h4", null, it.tit));
        box.appendChild(h("p", null, it.linhas.length ? it.linhas.join("\n") : "—"));
      });
    });
    document.body.appendChild(box);
    window.print();
    setTimeout(function () { box.remove(); }, 800);
  }

  /* ---------- desenhar ---------------------------------------------------- */
  var TELAS = { capa: telaCapa, carta: telaCarta, leitura: telaLeitura, secao: telaSecao, lista: telaLista, pergunta: telaPergunta,
    revisao: telaRevisao, mapa: telaMapa, checkin: telaCheckin, encerramento: telaEncerramento };
  function desenhar() {
    if (SO_CAPA) estado.i = 0;                            /* vitrine mostra sempre a capa */
    var passo = passos[estado.i];
    raiz.innerHTML = "";
    raiz.appendChild((TELAS[passo.tipo] || telaCapa)(passo));
    /* acessibilidade: a troca de tela leva o foco pro título (sem rolar), pro leitor de tela anunciar */
    var titulo = raiz.querySelector("h1, h2");
    if (titulo && !SO_CAPA) { titulo.setAttribute("tabindex", "-1"); try { titulo.focus({ preventScroll: true }); } catch (e) {} }
    document.documentElement.style.setProperty("--c-atual", fase(passo).cor);
  }

  addEventListener("pagehide", function () { salvar(true); });
  addEventListener("visibilitychange", function () { if (document.hidden) salvar(true); });

  desenhar();
  window.__percurso = { estado: estado, ir: ir, passos: passos, baixar: baixar, texto: montarTexto, preenchidas: preenchidas };
})();
