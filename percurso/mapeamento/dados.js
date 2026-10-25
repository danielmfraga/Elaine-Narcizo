/* ============================================================================
   PERCURSO: MAPEAMENTO — conteúdo
   Fonte: PDF "MAPEAMENTO" (Elaine Narcizo, Canva, 34 páginas) — texto transcrito
   por inteiro, na ordem do original, repartido em telas curtas ("uma coisa por tela").
   ----------------------------------------------------------------------------
   🔑 Este arquivo é SÓ CONTEÚDO. O motor (../_motor/motor-passos.js) desenha cada
   TIPO de tela; aqui só se diz quais telas existem, em que ordem e com que texto.
   (Os tipos e os blocos estão descritos no cabeçalho do motor-passos.js.)

   ✏️ CORREÇÕES FEITAS NO TEXTO (erros de digitação evidentes — a Elaine confirma):
     · "possibilidades possam possibilitem" → "possibilidades que possibilitem"
     · "R$ 500,00emprestado" → "R$ 500,00 emprestado" · "depoisPassar" → "depois passar"
     · "Serum corpo" → "Ser um corpo" · "estamos entendo" → "estamos entendendo"
     · "nos misturamos e vivenciarmos" → "nos misturarmos e vivenciarmos"
     · "já há havia pensando" → "já havia pensado" · "respotas" → "respostas"
     · "engôdo" → "engodo" · "a dependência" → "à dependência" · "realidadeo tempo" → "realidade o tempo"
     · "vaga- lumes" → "vaga-lumes" · "são as pessoas as que ela se direciona" → "são as pessoas a quem ela se direciona"
     · "es e a gente" → "e a gente" e "por aqu" → "por aqui" (poema; quebras de verso inferidas da diagramação)
   ❓ A CONFIRMAR COM A ELAINE: (1) a lista "Para quem eu peço ajuda?" repete "seus sonhos"
     (itens 4 e 10) — aqui ficou uma vez só; (2) "disbicando" no poema; (3) o parágrafo
     "além disso, ampliar nosso discernimento…" aparece DUAS vezes seguidas na virada
     de página — aqui entrou uma vez; (4) o PDF trata o leitor no feminino ("segura",
     "tê-la") — mantido; (5) o título "Mapeamento" na capa, o subtítulo e a chamada
     da capa são de autoria do site, derivados do "Propósito"; (6) as telas
     "Dois instrumentais", "Como preencher", o aviso de privacidade e o texto da pausa
     foram escritos para o formato digital.
   ============================================================================ */

window.PERCURSO = {

  id: "mapeamento",
  nome: "Mapeamento",
  subtitulo: "um percurso sobre as suas relações",
  autora: "Elaine Narcizo",
  versao: 1,                              /* ⚠️ subir isto invalida o progresso salvo de todo mundo */

  /* de onde o percurso é acessado (o ✕ e o "voltar ao site" levam pra lá) */
  voltar: "/#vivona",

  /* cada fase = uma cor; `sobre` = cor do texto POR CIMA dela; `ct` = a mesma cor, escurecida o bastante pra ler sobre o creme */
  fases: {
    intro:  { cor: "#E5264F", sobre: "#FFFFFF", ct: "#C71D43" },
    mapa:   { cor: "#F5A524", sobre: "#1B1A17", ct: "#A8620A" },
    brilho: { cor: "#4B5A3C", sobre: "#FFFFFF", ct: "#4B5A3C" },
    volta:  { cor: "#E5264F", sobre: "#FFFFFF", ct: "#C71D43" },
    fim:    { cor: "#F5A524", sobre: "#1B1A17", ct: "#A8620A" }
  },

  /* formas orgânicas próprias (vetor) no estilo do PDF: nada de ilustração de banco */
  deco: {
    cores: { amarelo: "#FCD78F", rosa: "#F69AA6", oliva: "#4B5A3C" },
    formas: {
      amarelo1: "<svg viewBox=\"-6 -6 212 212\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M171.1,100.0C169.2,119.1 163.1,138.7 151.3,151.3C139.4,163.8 116.2,176.3 100.0,175.4C83.8,174.4 69.0,158.4 54.1,145.9C39.3,133.3 14.3,118.7 10.8,100.0C7.4,81.3 18.5,44.3 33.4,33.4C48.3,22.5 78.4,34.2 100.0,34.8C121.6,35.3 151.3,26.0 163.1,36.9C175.0,47.7 173.1,80.9 171.1,100.0Z\"/></svg>",
      amarelo2: "<svg viewBox=\"-6 -6 212 212\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M171.4,100.0C174.5,119.6 180.2,153.6 168.3,168.3C156.4,182.9 122.0,188.4 100.0,187.7C78.0,186.9 51.1,178.4 36.2,163.8C21.4,149.1 9.0,119.3 11.0,100.0C12.9,80.7 33.1,63.6 48.0,48.0C62.8,32.3 83.1,5.5 100.0,5.9C116.9,6.4 137.5,34.9 149.4,50.6C161.3,66.2 168.3,80.4 171.4,100.0Z\"/></svg>",
      rosa1: "<svg viewBox=\"-6 -6 212 212\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M171.7,100.0C171.0,120.2 170.3,148.1 158.4,158.4C146.5,168.7 118.9,162.6 100.0,162.0C81.1,161.4 60.0,165.1 45.2,154.8C30.4,144.5 12.7,119.9 11.1,100.0C9.5,80.1 20.8,49.8 35.6,35.6C50.4,21.5 78.8,14.8 100.0,15.1C121.2,15.4 150.7,23.2 162.6,37.4C174.6,51.5 172.4,79.8 171.7,100.0Z\"/></svg>",
      rosa2: "<svg viewBox=\"-6 -6 212 212\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><path fill=\"currentColor\" d=\"M172.2,100.0C172.8,121.3 177.6,151.1 165.5,165.5C153.5,180.0 121.5,187.0 100.0,186.7C78.5,186.4 51.0,178.2 36.3,163.7C21.5,149.3 11.1,121.0 11.4,100.0C11.6,79.0 23.1,48.9 37.8,37.8C52.6,26.7 79.3,33.4 100.0,33.4C120.7,33.5 150.1,26.8 162.1,37.9C174.2,49.0 171.6,78.7 172.2,100.0Z\"/></svg>",
      fio: "<svg viewBox=\"0 0 120 320\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" d=\"M60,4C112,52 8,96 56,150S112,236 60,316\"/></svg>"
    },
    capa: [
      { forma: "amarelo1", cor: "amarelo", pos: "ca" },
      { forma: "rosa1",    cor: "rosa",    pos: "cb" },
      { forma: "fio",      cor: "oliva",   pos: "fio-r" }
    ],
    layouts: [
      [ { forma: "amarelo1", cor: "amarelo", pos: "tl" }, { forma: "rosa2",    cor: "rosa",    pos: "br" } ],
      [ { forma: "rosa1",    cor: "rosa",    pos: "tr" }, { forma: "amarelo2", cor: "amarelo", pos: "bl" }, { forma: "fio", cor: "oliva", pos: "fio-l" } ],
      [ { forma: "amarelo2", cor: "amarelo", pos: "mr" }, { forma: "rosa2",    cor: "rosa",    pos: "bl" } ],
      [ { forma: "rosa2",    cor: "rosa",    pos: "ml" }, { forma: "amarelo1", cor: "amarelo", pos: "br" }, { forma: "fio", cor: "oliva", pos: "fio-r" } ]
    ]
  },

  capa: {
    chamada: "O seu mundo de relações é maior do que você imagina.",
    tempo: "2 instrumentais · no seu ritmo",
    entrar: "Começar o percurso",
    retomar: "Continuar de onde parei"
  },

  passos: [

    /* ───────────────────────── ABERTURA ───────────────────────── */
    { tipo: "capa", fase: "intro" },

    { tipo: "carta", fase: "intro", rotulo: "Boas-vindas", etiqueta: "Boas-vindas", saudacao: "Saudações!",
      paragrafos: [
        "Olá! Desejo que esteja bem!",
        "É com imensa alegria que inicio esta jornada, e é uma verdadeira honra tê-la como companheira neste percurso! Desejo que este processo enriqueça sua perspectiva sobre si mesma e o mundo ao seu redor, proporcionando-lhe a ampliação de ideias, repertórios, criatividade e, consequentemente, mais alegria em sua vida e em seu trabalho!"
      ],
      assinatura: "Elaine Narcizo" },

    { tipo: "leitura", fase: "intro", rotulo: "Propósito", etiqueta: "Antes de começar", titulo: "Propósito",
      blocos: [
        "O propósito desta jornada é auxiliá-la a encontrar novas perspectivas e possibilidades que possibilitem:",
        { lista: [
          "Intensificar sua presença e, assim, por meio deste canal sensível, desfrutar melhor de relacionamentos;",
          "Reconhecer que seu campo relacional é vasto e diversificado além do que, provavelmente, você imagina;",
          "Explorar e experimentar os instrumentais aqui sugeridos para capacitá-la a trabalhar com outras pessoas nas perspectivas apresentadas."
        ] }
      ] },

    { tipo: "leitura", fase: "intro", etiqueta: "Antes de começar", titulo: "De onde vem este percurso",
      blocos: [
        "Este trajeto e tudo que ele envolve resulta de minha prática profissional como assistente social, educadora popular, artista e pesquisadora. Ao longo de décadas, dediquei-me a estudos, experimentações e pesquisas em diversos grupos, instituições e projetos, buscando forjar a efetividade e a simplicidade que você encontrará aqui. Sinceramente, desejo que esta jornada seja significativa para você, assim como tem sido para mim e para aqueles que participaram na construção deste percurso.",
        "Por fim, o objeto principal de minha prática é inspirar o aumento da alegria, do bem viver, do gostar de estar no mundo, com toda a complexidade que isso implica. Que durante e ao final desta jornada, você encontre as cores mais vibrantes de sua percepção diante do mundo e tome para si porções inesperadas das múltiplas formas de convivências!"
      ] },

    { tipo: "leitura", fase: "intro", rotulo: "Como será o percurso", etiqueta: "O percurso", titulo: "Dois instrumentais",
      blocos: [
        "Ao longo deste percurso, você realizará breves leituras e preencherá dois instrumentais:",
        { def: [
          ["I — Mapeamento das Relações", "O cerne deste processo reflexivo, que trata sobre as relações."],
          ["II — Para lembrar como brilho", "Vivência sensível para intensificar sua presença corporal."]
        ] },
        { destaque: "Você pode escrever aqui ou no papel — como preferir. Se fizer no papel, é só marcar “já fiz no papel” na etapa. O que você escrever aqui fica guardado só neste aparelho: nada é enviado para ninguém." }
      ] },

    /* ───────────────────────── PARTE 1 — MAPEAMENTO DAS RELAÇÕES ───────────────────────── */
    { tipo: "secao", fase: "mapa", rotulo: "Parte 1 · Mapeamento das relações", numero: "Parte 1", titulo: "Mapeamento das relações",
      chamada: "Vamos iniciar nosso percurso tranquilamente, então?", avancar: "Vamos" },

    { tipo: "leitura", fase: "mapa", etiqueta: "Instrumental I", titulo: "Mapeamento das Relações",
      blocos: [
        "Para iniciar, nós realizaremos o preenchimento do instrumental Mapeamento das Relações.",
        "Este instrumental é, como dito, o cerne deste processo; a partir dele iremos realizar uma série de reflexões. Sua elaboração e preenchimento é bastante simples. Por enquanto, você apenas o preencherá, nós retomaremos mais adiante. Após preencher, deixe-o reservado.",
        { h3: "Se preferir fazer no papel, os materiais são:" },
        { lista: ["1 folha para escrever (preferencialmente sulfite);", "1 lápis ou caneta."] }
      ] },

    { tipo: "leitura", fase: "mapa", etiqueta: "Instrumental I", titulo: "Como preencher",
      blocos: [
        { numeros: [
          "Escreva as perguntas numa folha, conforme o exemplo da tabela que você verá mais adiante. (Aqui, elas já estão prontas: uma por tela.)",
          "Depois de reproduzir as perguntas, identifique os sujeitos das respostas correspondentes."
        ] },
        { nota: "Não pense demais: o que vier primeiro serve. Vamos retomar tudo mais adiante." }
      ] },

    { tipo: "lista", fase: "mapa", id: "emprestimo", grupo: "mapa", nomeGrupo: "Mapeamento das Relações", curto: "Pedir R$ 500 emprestado",
      pergunta: "Para quem eu poderia pedir emprestado R$ 500,00?", dica: "Quem ou o quê responde a esta pergunta? Escreva um de cada vez." },
    { tipo: "lista", fase: "mapa", id: "segura", grupo: "mapa", nomeGrupo: "Mapeamento das Relações", curto: "Me sinto segura",
      pergunta: "Com quem me sinto segura?" },
    { tipo: "lista", fase: "mapa", id: "conversa", grupo: "mapa", nomeGrupo: "Mapeamento das Relações", curto: "Conversar por 4 horas",
      pergunta: "Com quem posso conversar durante 4 horas seguidas?" },
    { tipo: "lista", fase: "mapa", id: "ajuda", grupo: "mapa", nomeGrupo: "Mapeamento das Relações", curto: "Peço ajuda",
      pergunta: "Para quem eu peço ajuda?" },
    { tipo: "lista", fase: "mapa", id: "prazer", grupo: "mapa", nomeGrupo: "Mapeamento das Relações", curto: "Sinto prazer",
      pergunta: "Com quem sinto prazer?" },
    { tipo: "lista", fase: "mapa", id: "cuido", grupo: "mapa", nomeGrupo: "Mapeamento das Relações", curto: "Eu cuido",
      pergunta: "De quem eu cuido?" },
    { tipo: "lista", fase: "mapa", id: "aprendo", grupo: "mapa", nomeGrupo: "Mapeamento das Relações", curto: "Aprendo",
      pergunta: "Com quem aprendo?" },
    { tipo: "lista", fase: "mapa", id: "ensino", grupo: "mapa", nomeGrupo: "Mapeamento das Relações", curto: "Aprende comigo",
      pergunta: "Quem aprende comigo?" },

    { tipo: "mapa", modo: "inicio", fase: "mapa", rotulo: "Seu mapa (primeira versão)", etiqueta: "Instrumental I",
      titulo: "Sua tabela ficará mais ou menos assim",
      blocos: ["Estas são as suas listas até aqui. Não precisa estar “completo”: a ideia, por enquanto, é apenas preencher, deixar reservado e retomar mais adiante."],
      avancar: "Guardar e continuar" },

    /* ───────────────────────── PARTE 2 — PARA LEMBRAR COMO BRILHO ───────────────────────── */
    { tipo: "secao", fase: "brilho", rotulo: "Parte 2 · Para lembrar como brilho", numero: "Parte 2", titulo: "Para lembrar como brilho",
      chamada: "Uma pequena vivência. Pequena, mas fundamental.", avancar: "Vamos" },

    { tipo: "leitura", fase: "brilho", etiqueta: "Instrumental II", titulo: "Para lembrar como brilho",
      blocos: [
        "Ao preenchermos o Mapeamento das Relações, é realmente interessante notar como nos sentimos quando voltamos nossa atenção para nossas relações. Às vezes, essa reflexão pode se assemelhar a redescobrir um tesouro esquecido, que precisa ser valorizado e melhor cuidado. Por outro lado, pode também trazer à tona questões desafiadoras que nem sempre são agradáveis de lidar. Além disso, também pode nos proporcionar uma melhor compreensão de nossa solidão, ou revelar a riqueza de relações que possuímos em nossa vida. Em qual dessas situações você sente que está?",
        "Bem, de modo geral, todos nós enfrentamos desafios em nossas relações. Talvez, esse seja o mais valioso e incessante trabalho que temos ao longo da vida: cultivar o jardim de nossas relações.",
        "Cultivar relações exige, sobretudo, atenção, respeito e tempo, aspectos que nos escapam de maneira considerável, hoje em dia."
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Instrumental II", titulo: "Uma pequena vivência",
      blocos: [
        "E para pensarmos e ressignificarmos essas questões, que envolvem deslocamentos de perspectivas em relação a nossas prioridades, ressignificação do cuidado e abertura de percepções para como lidamos com o tempo, vamos fazer agora uma pequena vivência. Pequena, mas fundamental.",
        "É um convite para direcionarmos nossa atenção e inteligência para aspectos pouco convencionais ou frequentemente negligenciados nas relações que estabelecemos.",
        "Vamos lá, então… Para este exercício, pegue uma folha de papel e uma caneta, em seguida responda às questões que virão — aqui ou no papel.",
        { destaque: "É fundamental que você não leia as questões em sequência. Leia a primeira, então responda. E só então, passe para a próxima pergunta, combinado?" }
      ],
      avancar: "Combinado" },

    { tipo: "pergunta", fase: "brilho", id: "b1", grupo: "brilho", nomeGrupo: "Para lembrar como brilho", curto: "Pergunta 1",
      nota: "Responda uma pergunta e somente depois passe para a outra.",
      enunciado: "Pense por um instante nas relações mais importantes para você, se dê um tempo para isso. Descreva de forma livre, sobre essas relações, seus sentimentos e o que mais julgar interessante." },
    { tipo: "pergunta", fase: "brilho", id: "b2", grupo: "brilho", nomeGrupo: "Para lembrar como brilho", curto: "Pergunta 2",
      enunciado: "Agora, pense naquelas relações com as quais você julga ser impossível viver sem." },
    { tipo: "pergunta", fase: "brilho", id: "b3", grupo: "brilho", nomeGrupo: "Para lembrar como brilho", curto: "Pergunta 3",
      enunciado: "Você, em algum momento, pensou em sua relação com o seu corpo?" },
    { tipo: "pergunta", fase: "brilho", id: "b4", grupo: "brilho", nomeGrupo: "Para lembrar como brilho", curto: "Pergunta 4",
      enunciado: "Caso sua relação com seu corpo não tenha surgido como algo primordial, essencial, o que isso significa? Pense um pouco sobre isso, escreva." },

    { tipo: "leitura", fase: "brilho", rotulo: "O corpo", etiqueta: "Instrumental II", titulo: "Quem são os envolvidos?",
      blocos: [
        "Aqui, podemos começar a perceber a importância de uma melhor compreensão e valorização do que chamamos de “relação”. De fato, ao discutirmos sobre relações, surge uma pergunta importante: quem são os envolvidos? Essa questão não é óbvia, pois aqueles que reconhecemos como os protagonistas da relação é o que verdadeiramente define e influencia nosso universo de vida. A identificação e consideração de quem ou daquilo que consideramos “sujeito” desempenha um papel fundamental nesse contexto.",
        "E quando o corpo é negligenciado como epicentro primordial das relações sociais, uma ausência significativa é erroneamente interpretada como presença. O cerne dessa ausência reside no descuido das diversas formas de percepções que podemos estabelecer com nosso próprio corpo e com a corporeidade do mundo. Essa forma de ausência é muito mais frequente do que imaginamos ou compreendemos."
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Instrumental II", titulo: "Corpo vivo",
      blocos: [
        "É importante observar não apenas a falta de relação com nosso próprio corpo, mas também refletir sobre a natureza dessa falta. Um exemplo claro disso é a situação daqueles que frequentam academias, aulas de yoga, pilates, ciclismo, dança, entre outros, e que não concebem a relação com o próprio corpo como primordial, como talvez pode ser verificado na vivência que acabamos de realizar. Muitas vezes, isso ocorre devido ao estabelecimento de uma via única de atenção, ou poucas vias.",
        { destaque: "Corpo vivo é sinônimo de presença autêntica." },
        "Para alcançarmos uma presença significativa, vital e satisfatória — ou seja, para nos tornarmos corpo vivo — podemos refletir sobre dois elementos e princípios essenciais que nos auxiliam a construir essa qualidade de presença. Vamos a eles:"
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Primeiro princípio", titulo: "“Ter um corpo” difere de “Ser um corpo”",
      blocos: [
        "No “ter”, o corpo é considerado uma propriedade privada, uma posse pessoal, sobre a qual se exerce controle absoluto. Nesse contexto, a liberdade de fazer o que se deseja supera considerações relacionadas aos tempos, ritmos, limitações e potencialidades do corpo. Por outro lado, “Ser um corpo” implica, principalmente, uma relação caracterizada pela atenção, escuta e intimidade. Nesse caso, a atenção recai sobre o encontro e a aceitação da natureza singular revelada pelos ritmos e tempos do corpo. Dentro dessa perspectiva, é possível reconsiderar o paradigma da fruição corporal, pensando-o nas dimensões da satisfação e do respeito, para além somente da busca incessante do prazer imediato.",
        "Nesse sentido, ao “Ser um corpo”, a questão não se limita apenas ao que se fará, mas também a como e com quem será feito. Dito de outra forma, em experiências que envolvem “Ser um corpo”, as relações desempenham um papel fundamental, e as questões éticas se tornam mais evidentes.",
        "É por isso que as formas de relacionamento com o próprio corpo influenciam de maneira significativa as relações com o todo. Ser um corpo e as formas das relações que estabelecemos são elementos que estão intrinsecamente interligados."
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Segundo princípio", titulo: "A autenticidade do autocuidado",
      blocos: [
        "Refletir sobre a necessidade de autenticidade do autocuidado. Como podemos falar em autocuidado verdadeiro se deixamos toda a responsabilidade e conhecimento desse cuidado nas mãos dos outros? É crucial que, em algum sentido ou aspecto, forjemos nosso próprio autocuidado, e que isto seja resultado de uma escuta atenta e respeito por nós mesmos. Nesse sentido, o autocuidado deve ser um espaço no qual nos surpreendemos, onde nos redescobrimos. Muitas vezes, associamos a criatividade a outras dimensões da vida, mas sermos criativos e autênticos em relação ao nosso autocuidado pode ser uma das formas mais consistentes de liberdade, saúde e beleza. Devemos encontrar maneiras originais de nos cuidarmos. Ao fazer do autocuidado um espaço de autenticidade e criatividade, mudamos as formas de relação conosco mesmos."
      ] },

    { tipo: "checkin", fase: "brilho", titulo: "Está tudo bem até o momento? Continuemos?",
      blocos: ["Se algo mexeu com você, é natural. Você pode seguir agora ou fazer uma pausa."],
      continuar: "Continuemos", pararRotulo: "Preciso de uma pausa",
      pausa: "Tudo bem. Respire. O que você escreveu está guardado neste aparelho, e o percurso continua exatamente daqui quando você voltar — sem pressa." },

    { tipo: "leitura", fase: "brilho", etiqueta: "Instrumental II", titulo: "Outra forma de se relacionar com o corpo",
      blocos: [
        "Bem, então, uma maneira de ressignificar sua relação com o corpo é reconhecer que você pode ter diversas e diferentes formas de se relacionar com ele.",
        "Escrevi um texto sobre o corpo com o intuito de desafiar alguns conceitos estabelecidos e renovar alguns aspectos de nossas concepções em relação ao corpo. Vamos até ele?"
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Um texto da Elaine", titulo: "Sobre o corpo",
      blocos: [
        { citacao: [
          "“Às vezes, as coisas não estão muito boas pra sua mente, mas seus rins estão bem, numa peleja danada para te deixar hidratada. Às vezes, seu coração está partido, mas seu intestino está fazendo tudo certinho. Às vezes, sua bunda está flácida, mas seus cabelos estão ao vento. Às vezes, seu olhar está perdido na paisagem, mas sua pele sabe a direção do carinho. A concepção mente, corpo e espírito é importante, mas ao mesmo tempo, ela pode ser uma armadilha. Poxa, às vezes, não rolou para suas ideias, mas suas mãos estão hábeis, não estão vencidas e elas são seu segundo cérebro! Para o corpo, sempre há uma outra porta de saída. Sempre há, de alguma maneira, formas de segundas chances, outras perspectivas… existem fluidos, centenas de ossos, articulações, renovações e tudo isso é passível de te fazer bem, são seus… tudo isso quer viver. As coisas estão ruins de um lado, não tem problema, acontece, de repente, é a vez do seu fígado estar feliz. Preste atenção nisso, aliás, você já havia pensado nisso?”"
        ], autoria: "Elaine Narcizo" }
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Instrumental II", titulo: "Um corpo que não é uma coisa só",
      blocos: [
        "Dirija sua atenção à riqueza e à complexidade que compõem sua corporeidade. Pratique a arte de perceber as diversas nuances que constituem seu corpo, amplie suas formas de relação com ele. Essa atenção ajudará a liberá-la das amarras dos extremos inflexíveis. Seu corpo é uma fonte de prazer, autocuidado e autoestima, e estamos entendendo isso. Essa percepção se aprofundará quando você compreender que seu corpo não deve ser encarado como uma unidade homogênea, ou seja, sem diferenciação nele mesmo, em seus mais delicados ritmos, texturas e movimentos."
      ] },

    { tipo: "leitura", fase: "brilho", rotulo: "Misturados venceremos!", etiqueta: "Instrumental II", titulo: "Misturados venceremos!",
      blocos: [
        "Estamos, atualmente, em uma condição de limitação profunda, incapazes de construir diálogos verdadeiramente significativos, compartilhar experiências genuínas e nos conectarmos completamente com pessoas, ambientes e circunstâncias. Em resumo, nossa capacidade de nos misturarmos e vivenciarmos plenamente a vida encontra-se consideravelmente restringida.",
        "Estabelecemos um padrão em nossas relações, procurando afinidades em aspectos como classe social, idade, formação cultural, visões políticas, gênero e outros. Essa busca por similaridades nos oferece uma sensação de conforto e familiaridade, fortalecendo apenas o que já conhecemos e aceitamos (e é intrigante notar que, ao fato de estarmos ilhados em nossas relações habituais, damos o nome de segurança)."
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Instrumental II", titulo: "Os mesmos papéis de sempre",
      blocos: [
        "É fundamental reconhecer que restringir a diferenciação entre os nossos relacionamentos é a forma mais eficaz de manter o mundo inalterado. Mas, e aqui é o ponto fundamental, a mudança significativa não reside apenas na introdução de novos sujeitos, mas sim na transformação das interações entre sujeitos. Em outras palavras, para alcançar um mundo diferente, mais terno e com mais sentido, é necessário modificar a maneira como nos relacionamos umas com as outras.",
        "Enquanto continuarmos desempenhando os mesmos papéis de sempre e encaixando os outros em seus papéis habituais, estaremos meramente replicando a mesma dinâmica relacional, variando apenas os indivíduos envolvidos, seja com relação ao nosso corpo, uma flor ou uma pessoa. Não é suficiente apenas estabelecer conexões; é fundamental compreender a base subjacente a essas conexões."
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Um texto da Elaine", titulo: "Sobre meus amigos",
      blocos: [
        "Escrevi um texto, sobre minha relação com alguns amigos. Vou compartilhá-lo porque nele falo um pouco sobre essa questão dos papéis pré-estabelecidos e como assumimos isso, ou somos naturalmente convidados a assumir, sem nos darmos conta. Segue o texto:",
        { citacao: [
          "“eu tenho amigos de 4, 8, 10 e 15 anos. quando falo para alguém que estou com eles, ou que estive com eles e, conto algo, as pessoas dizem: “ahhh são seus sobrinhos?” “você está cuidando?” “ahhh, ser tia é tão bom né, melhor que ter filhos…” não. Eu não sou tia desses meus amigos. Eu não sou tia dessas pessoas que conheço. eles com a vida deles, com os desafios de seu amadurecimento, seus problemas, seus encantos, suas limitações, exatamente como eu, em minha vida. As crianças que crescem reconhecendo nos outros tios e tias, muitas vezes, desenvolvem muito pouco a habilidade de conquistar amigos. Elas vão se tornando reféns do “cuidado/tutela” alheio e ficam enfraquecidas em sua capacidade de construir uma teia de relações onde elas possam ser elas mesmas. fico olhando como é, de forma geral, difícil e improvável ter uma criança, um pré-adolescente, ou um adolescente como um amigo. automaticamente, nos tornamos tutores, tios e tias, dessas pessoas. o que significa saber naturalmente o que é melhor e mais adequado para eles e elas.",
          "…como se não fôssemos, nós mesmos, no fundo, as crianças mais velhas, artistas, esportistas, educadores, pacientes de ambientes terapêuticos, rituais, religiões, tentando resolver traumas de nossa infância. no entanto, olhamos para as pessoas mais novas, como se não estivéssemos todos no mesmo barco e, portanto, à mercê de toda espécie de abuso, violência, solidão e desamparo que significa ir assumindo uma vida adulta, em uma sociedade adoecida, com moleques mimados e sem limites no poder, com mulheres tentando ser a boneca com a qual brincaram, com idosos enfiados em casa, sem nenhuma vontade e interesse de ir pra rua compartilhar com os mais novos. não podemos nos sentir apenas cuidadores das crianças, é precisamente isso que nos impede de vê-las como pessoas. elas se tornam seres que dão trabalho e que têm um mundo paralelo ao nosso."
        ], autoria: "Elaine Narcizo" }
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Um texto da Elaine", titulo: "Sobre meus amigos (continuação)",
      blocos: [
        { citacao: [
          "não!!! os mais novos aprendem a se cuidar quando nós nos cuidamos porque estamos junto com eles. meus amigos se interessam muito mais com o que eu faço com eles, do que com o que eu faço por eles, como qualquer bom amigo, como qualquer amizade genuína, onde as pessoas se sentem bem por poderem ser aquilo que são em suas atuais condições…e assim, a gente se cuida, melhora, rejuvenesce, envelhece e vive.”"
        ], autoria: "Elaine Narcizo" },
        "Dito isso, ou seja, considerando a importância de ampliarmos nossos horizontes e perspectivas em relação aos protagonistas de nossas relações, vamos agora avançar um passo além nesse caminho.",
        "Estamos discutindo a expansão de nossos modos de perceber, ou seja, nossas concepções, por isso, façamo-nos uma pergunta bem simples:",
        { pergunta: "Em última análise, quem são os sujeitos dessas relações?" }
      ] },

    { tipo: "leitura", fase: "brilho", rotulo: "Relações não são só humanas", etiqueta: "Instrumental II", titulo: "Relações não são só humanas",
      blocos: [
        { destaque: "Aqui, alcançamos um ponto fundamental em nossa jornada: é necessário compreender que RELAÇÕES não se limitam apenas aos SERES HUMANOS. Devemos entender que as relações sociais não são equivalentes a relações humanas!" },
        "Podemos estabelecer vínculos com a totalidade do que existe! Isso nos convida a interagir com um mundo vasto e modalidades de existência infindáveis, mínimas existências, imensas existências, breves ou longas vidas. Somente quando percebemos que podemos nos relacionar com a totalidade da existência, nossa vida pode ser enriquecida pelas diversas nuances, ambivalências, cores, significados, ritmos e mudanças que compõem o mundo."
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Instrumental II", titulo: "A chuva, o verão, o silêncio",
      blocos: [
        { lista: [
          "Como me relaciono com as estações do ano, os demais seres vivos, as plantas, a água, e com o que consumo e descarto?",
          "Todos nós possuímos uma relação com a chuva, mas que natureza essa relação assume? Será que existe apenas um único tipo de chuva?",
          "Todos nós experimentamos o verão, mas qual é a minha relação com essa estação?",
          "No outono, que aspecto da minha personalidade se destaca?",
          "Tenho preferência pela luz matinal ou vespertina?",
          "Qual conversa estabeleço com o silêncio?",
          "Como a neblina me faz companhia?"
        ] }
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Instrumental II", titulo: "Quem são as outras e os outros?",
      blocos: [
        "Essa pergunta é fundamental, pois é ela que determina a amplitude e a intensidade de nossa experiência no mundo. Quanto mais diversificadas forem as respostas, mais significados podemos elaborar, mais sentimentos podemos experimentar. Ampliar o espectro de sujeitos com os quais nos relacionamos é uma questão ética que também molda nossa relevância no mundo.",
        "Para inspirar essa discussão, abaixo, compartilho um poema que escrevi, que aborda como o estabelecimento de relações pode e deve transpor os limites das relações humanas, fundando a confiança na vida, a partir do vínculo com o mundo. Segue o poema logo abaixo:"
      ] },

    { tipo: "leitura", fase: "brilho", rotulo: "Poema · Trincheira de vida", etiqueta: "Poema de Elaine Narcizo", titulo: "Trincheira de vida",
      blocos: [
        { poema: [
          ["Não desista", "As pessoas às vezes não compensam mesmo", "Mas não dá pra dizer que o mundo é uma droga", "Existem os pandas as vacas os passarinhos coloridos as baleias e suas caldas os filhotinhos", "De jacaré os gatinhos fofos os cachorros"],
          ["Não desista", "O mundo não é do tamanho do sistema", "Existem árvores muito mais antigas que", "A última nova notícia tremenda sobre economia"],
          ["Não desista", "No fundo da Amazônia existe uma pessoa que tem um avô que é um rio e que não se", "Sente só não porque encontrou gente decente na balada mas", "porque seu avô escorre entre seus dias"],
          ["Não desista", "Não acredite ou deixe de acreditar no mundo somente por conta das pessoas", "Para além da religião", "Para além da ideologia", "Para além da política", "A gente precisa entender que é uma honra estar num mundo com nuvens com formato", "De pipa disbicando com a brisa…", "Não desista do universo", "Há muito mais insetos que gente no mundo", "Uma borboleta vale que você esteja por aqui"]
        ] }
      ] },

    { tipo: "leitura", fase: "brilho", etiqueta: "Poema de Elaine Narcizo", titulo: "Trincheira de vida (continuação)",
      blocos: [
        { poema: [
          ["Não desista do mar porque você está no asfalto", "Não desista dos nascimentos das flores porque o noticiário só fala de assassinatos", "as montanhas estão grávidas de horizontes"],
          ["Não desista", "Não desista do mundo por conta das pessoas", "Elas não são a coisa mais importante", "E se tudo der errado e a gente se matar por aqui", "A lua cheia continuará e terá lembranças de sua vista… o que já vale uma vida", "Não se torne mais uma espécie em extinção", "Não seja mais um zumbi faminto de gente", "Não raro relação humana é mortal", "Faça amizade com o vento cuide do seu lixo e da água plante árvores… e ajude a salvar", "Algum sentido mais bonito da vida", "Porque o planeta continuará por aqui… fique tranquilo", "E se for para acreditar em algum ser humano", "Defenda com unhas e dentes", "Nossas crianças indígenas."]
        ] }
      ] },

    /* ───────────────────────── PARTE 3 — DE VOLTA AO COMEÇO ───────────────────────── */
    { tipo: "secao", fase: "volta", rotulo: "Parte 3 · De volta ao começo", numero: "Parte 3", titulo: "De volta ao começo",
      chamada: "Chegamos ao ponto essencial, o cerne do nosso processo.", avancar: "Vamos" },

    { tipo: "leitura", fase: "volta", etiqueta: "Parte 3", titulo: "Avaliação e segunda chance",
      blocos: [
        "Após percorrermos toda essa trajetória, chegamos agora ao ponto essencial, o cerne de nosso processo. Tendo sido instigados a refletir sobre questões fundamentais, frequentemente subestimadas, estamos agora mais sensibilizados para reavaliar e dar novo sentido a muitos aspectos de nossas vidas, relacionados às nossas relações. Por favor, retome o Mapeamento das Relações que você preencheu. Vamos embarcar em um processo que abordará cada uma dessas respostas. Iremos analisar minuciosamente cada pergunta, com o objetivo de identificar questões de relevância, especialmente aquelas que podem ampliar suas perspectivas e enriquecer sua experiência no mundo.",
        { destaque: "Avaliação e segunda chance, porque a vida pode ser feita de muitas segundas chances…" },
        "Nesta etapa, provavelmente, irá fazer com que muitos outros sujeitos façam parte de suas respostas, ou seja, que você reconheça que seu campo relacional é, ou pode ser, muito mais amplo e diversificado do que você imaginou até o momento. Esse é, sem dúvida, o tesouro inestimável que você tem."
      ] },

    { tipo: "leitura", fase: "volta", etiqueta: "Parte 3", titulo: "Um tesouro inestimável",
      blocos: [
        "Compreender que não estamos tão isoladas como às vezes supomos, ou como nos fazem acreditar, é a verdadeira essência da liberdade, pois a medida das nossas possibilidades e oportunidades está intrinsecamente relacionada à multiplicidade das nossas relações.",
        "Esse exercício de reconhecer a riqueza de suas relações é, como mencionado anteriormente, um tesouro inestimável. Um tesouro que lhe proporcionará alegria, vitalidade, fé e inúmeras outras formas de felicidade.",
        "É uma forma de nascimento ou renovação saber que existem inúmeras formas de amores, amigos, confidentes e companheiros de viagem. É muito importante que você faça um exercício crítico, no qual você reconheça e reflita sobre o empobrecimento de seu campo relacional. Esta questão é incontornável. No entanto, o movimento mais importante é o esforço para reconhecer que suas relações são mais ricas do que o que você julga. Talvez, isso não estivesse tão claro, até aqui."
      ] },

    { tipo: "leitura", fase: "volta", etiqueta: "Parte 3", titulo: "Como vamos rever as respostas",
      blocos: [
        "Agora, você irá rever suas respostas. Primeiro, farei uma série de questionamentos relacionados a cada pergunta que você respondeu. Você irá acompanhar os questionamentos e colocá-los em perspectiva com suas respostas, ok? Reserve algumas folhas em branco, pois seria importante responder por escrito as perguntas que farei. Depois de respondê-las, retome suas respostas do mapeamento porque, provavelmente, surgirão outros sujeitos em suas respostas, verifique isso com atenção e amplie sua lista. Faça isso para cada pergunta, com atenção, não se apresse. É importante também que você reconheça sujeitos que nunca tinha observado ou até mesmo valorizado. A vida é do tamanho de suas relações, aproveite para observar como ela, a vida, é sempre imensa.",
        { nota: "Aqui, cada tela mostra a sua lista de antes. O que você acrescentar fica separado, em outra cor — a sua lista original não muda." },
        { pergunta: "Vamos começar com a primeira pergunta e prosseguir com as demais, uma por uma. Vamos lá?" }
      ],
      avancar: "Vamos lá" },

    { tipo: "revisao", fase: "volta", id: "r1", ref: "emprestimo", grupo: "volta", nomeGrupo: "Revisão", curto: "Pedir R$ 500",
      pergunta: "“Para quem eu poderia pedir emprestado R$ 500,00?”",
      reflexoes: [
        "Existe algum banco em suas respostas? Se não, por que não?",
        "O que significa quando apenas sua família aparece como resposta?",
        "O que isso implica quando somente pessoas muito íntimas são mencionadas em suas respostas?",
        "Considerando uma abordagem mais madura, por que não considerar conversar, formalizar um acordo e pedir emprestado esse valor, que não é excessivamente alto, a um grupo maior de pessoas? Existe uma conotação de infantilização nesse sentido?",
        "Como o dinheiro está profundamente associado à intimidade? Você observa algum tipo de associação mal resolvida entre dinheiro e intimidade?",
        "Qual seria a diferença em suas respostas se o valor fosse de R$ 10.000, e o que isso implicaria?",
        "Mulheres: existem várias mulheres em suas respostas?",
        "Há algum jovem mencionado? Qual é o significado disso?"
      ],
      fecho: [
        "É crucial perceber como a intimidade e o dinheiro estão interligados, muitas vezes ocupando o mesmo espaço que o amor em nossas vidas.",
        "Faça o teste: revisite suas respostas e observe como as pessoas a quem você pode pedir dinheiro emprestado são, geralmente, as mesmas que você ama ou com quem tem uma amizade profunda. Isso pode parecer lógico, mas não deveria ser sempre assim.",
        "Idealmente, deveríamos ser capazes de pegar dinheiro emprestado com base em acordos claros e bem definidos, em vez de depender exclusivamente de sentimentos de confiança e intimidade.",
        "Misturar dinheiro com intimidade é uma das armadilhas mais perigosas que vivemos. Quando o dinheiro se entrelaça somente com as relações íntimas e domésticas, ocorre uma fragilização associada ao medo, ao fracasso e à dependência. Você consegue observar que essa dependência pode ser entendida como um engodo, pois bastaria estender a sua resposta a um banco, por exemplo? Especialmente para mulheres, é muito importante observar isso, na verdade, é algo bastante libertador e um dispositivo de autonomia considerável, pois quando você entende que o dinheiro não é parte de um afeto, mas parte de uma transação econômica ou financeira, você se fortalece. Essa distinção fortalece a sua autonomia e confiança, permitindo que você navegue pelas questões financeiras com mais segurança e menos vulnerabilidade emocional. Por isso, é muito importante reavaliar os sujeitos de suas respostas e ampliar sua lista, um jovem com quem você tenha contato pode ser sim alguém para quem você poderia pedir R$ 500,00 emprestado, isso provavelmente recoloca muitos de seus valores e perspectivas, e é justamente este exercício proposto aqui, sair da zona íntima, doméstica, e ressignificar o espaço dessas relações."
      ] },

    { tipo: "revisao", fase: "volta", id: "r2", ref: "segura", grupo: "volta", nomeGrupo: "Revisão", curto: "Me sinto segura",
      pergunta: "“Com quem me sinto segura?”",
      reflexoes: [
        "Você mesma está incluída em suas respostas? Se não, por que não?",
        "Sua inteligência, perspicácia e sagacidade estão entre aquilo que lhe deixa segura?",
        "Os livros, estudos, formações e capacitações estão presentes em suas respostas? O que isso indica?",
        "Estar entre as juventudes lhe proporciona segurança? Por quê? Qual é o significado disso?",
        "Durante o amanhecer, anoitecer, enfim, em algum momento do dia, você sente sua segurança em relação a si mesma renovada? Isto é importante, pense mais sobre isso para usufruir melhor.",
        "Sua força física é um fator de segurança?",
        "Sua beleza é um elemento de segurança ou insegurança para você?"
      ],
      fecho: [
        "A segurança pode ser experimentada de várias maneiras e sustentada por diferentes fontes. Quando você se baseia em um único parâmetro de segurança, acaba se tornando bastante vulnerável. O que realmente protege sua integridade física e mental é a combinação de múltiplas formas de segurança, nesse sentido, aproveite para observar como sua rede de proteção é mais sólida e abrangente do que você imagina."
      ] },

    { tipo: "revisao", fase: "volta", id: "r3", ref: "conversa", grupo: "volta", nomeGrupo: "Revisão", curto: "Conversar por 4 horas",
      pergunta: "“Com quem posso manter uma conversa contínua de 4 horas?”",
      reflexoes: [
        "Você mesma está incluída em suas respostas?",
        "Suas respostas refletem a diferença entre simplesmente jogar conversa fora e desabafar ou confidenciar? Verifica-se em suas respostas estas diversidades e modalidades de diálogo e companhia?",
        "Aprofundar em tópicos e debates é um fator significativo para a sua saúde mental? Sua lista inclui muitos parceiros para essas conversas? Qual é a sua perspectiva sobre isso?",
        "Uma caneta e uma folha de papel podem ser interlocutores importantes, concorda? Além de pessoas, existem outras formas de interlocução. Reflita sobre isso.",
        "O presente, o agora, é interlocutor fundamental, ou apenas o passado e o futuro têm voz dentro de você?"
      ],
      fecho: [
        "Aqui estamos abordando a importância da comunicação e da conexão, elementos essenciais que, sem eles, nos embrutecemos. A primeira comunicação fundamental é a que você estabelece consigo mesma. É interessante refletir sobre os meios que facilitam essa conexão. O processo de autoconhecimento pode ser complexo, mas também pode se manifestar de maneiras simples, como observar a respiração, manter um diário, cuidar de uma planta ou aperfeiçoar uma receita. Além disso, a comunicação com o mundo exterior envolve se manifestar e expressar suas ideias. É fascinante perceber que nossos interlocutores não são apenas pessoas, mas também diversas formas possíveis de interação. Quais são elas? Reflita sobre isso."
      ] },

    { tipo: "revisao", fase: "volta", id: "r4", ref: "ajuda", grupo: "volta", nomeGrupo: "Revisão", curto: "Peço ajuda",
      pergunta: "“Para quem eu peço ajuda?”",
      reflexoes: [
        "Para a poesia?", "Para a música?", "Para a respiração?", "Para os seus sonhos?", "Para sua coragem?",
        "Para os livros?", "Para sua intuição?", "Para sua imaginação?", "Para sua história de vida?"
      ],
      fecho: [
        "O quanto nos sentimos à vontade para buscar apoio e o quanto nos sentimos acolhidos e seguros influenciam diretamente nosso nível de vulnerabilidade e o grau de exposição que experimentamos. Isso, por sua vez, afeta significativamente o quão dispostos estamos a nos arriscarmos e a explorarmos novas situações. Em muitos casos, as pessoas acreditam que têm uma rede de apoio muito limitada, pois sua percepção do mundo as restringe a poucas pessoas, normalmente amigos confiáveis ou familiares. No entanto, é importante destacar que, embora em certos momentos dependamos completamente de outras pessoas, essa não é a realidade o tempo todo, e muitas vezes não nos damos conta disso. O mundo, para além dos seres humanos, apesar de suas adversidades, é também um lugar generoso que oferece diversas formas de apoio, sustentação e acolhimento. Essa é uma oportunidade para reconhecer e aproveitar essas possibilidades."
      ] },

    { tipo: "revisao", fase: "volta", id: "r5", ref: ["prazer", "cuido"], grupo: "volta", nomeGrupo: "Revisão", curto: "Prazer e cuidado",
      pergunta: "“Com quem sinto prazer? De quem eu cuido?”",
      reflexoes: [
        "Sua curiosidade lhe proporciona prazer? Qual é a razão por trás disso?",
        "Sua própria presença é uma fonte de prazer para você?",
        "Além do prazer sexual e do prazer físico, quais outras formas de prazer existem? Como está sua vida em relação a essas outras fontes de prazer?",
        "O sol, a lua, a chuva e o vento são capazes de lhe proporcionar prazer?",
        "Seus sentidos, como a visão, o tato, o paladar, o olfato e a audição, desencadeiam prazer? Descreva isso."
      ] },

    { tipo: "revisao", fase: "volta", id: "r6", ref: "aprendo", grupo: "volta", nomeGrupo: "Revisão", curto: "Aprendo",
      pergunta: "“Com quem aprendo?”",
      reflexoes: [
        "Na sua lista, há alguma criança que não faça parte da sua família? Como você percebe essa inclusão ou exclusão?",
        "A literatura, a poesia e a filosofia fazem parte das suas respostas?",
        "Quanto a sentimentos, existe algum deles que se destaque na sua lista? Reflita sobre isso."
      ],
      fecho: [
        "As grandezas imensuráveis, como o universo, o cosmos, divindades, as paixões, têm muito a nos ensinar. Da mesma forma, as minúcias, as existências mínimas, as formigas, os ciscos e os vaga-lumes. Observe o que a comove e permita-se ser ensinada com maior frequência por essas vastas ou pequenas escalas do conhecimento e sensibilidade."
      ] },

    { tipo: "revisao", fase: "volta", id: "r7", ref: "ensino", grupo: "volta", nomeGrupo: "Revisão", curto: "Aprende comigo",
      pergunta: "“Quem aprende comigo?”",
      intro: [
        "Esta pergunta pode ser a mais fundamental de todas. Não porque evidencie sua sabedoria ou conhecimento, mas porque revela como você inspira e quem se interessa pelo que você tem a dizer. O tamanho desta lista, os sujeitos que a compõem, representam o tamanho do seu mundo. Quem são essas pessoas? Isso é de uma importância imensa. Nessa lista está implícito a quem ou que você se dedica de maneira mais intensa e interessada. Muitos preconceitos, limitações e dificuldades surgem ou se fundamentam aqui e estão diretamente relacionados a quem você está disposta a tornar maior, melhor e mais belo, e seu mundo tem precisamente esse tamanho. Tomemos, por exemplo, uma influenciadora feminista que alega que mulheres são as pessoas a quem ela se direciona exclusivamente. Isso evidencia que uma boa parte da conversa não está sendo feita, não é mesmo? Pois existem muitos outros atores na sociedade que também devem participar da discussão. Observar quem aprende conosco e o que temos ensinado ou compartilhado é de suma importância. Essa atenção revela nosso propósito e a que nos dedicamos. E isso, em última instância, é o sentido da vida, e é por isso que essa pergunta é tão vital."
      ] },

    /* ───────────────────────── FECHAMENTO ───────────────────────── */
    { tipo: "leitura", fase: "fim", rotulo: "Então…", etiqueta: "Então…", titulo: "Terminemos de maneira radical",
      blocos: [
        "Terminemos esse processo de maneira radical: a mensagem fundamental desse percurso que você experimentou é que, na verdade, é mais difícil estarmos verdadeiramente sozinhos do que imaginamos. Como vimos, como entendemos quem são os sujeitos de nossas relações determina nossa percepção. O vento, a lua, as estações do ano são também sujeitos.",
        "Além disso, ampliar nosso discernimento em relação às pessoas com as quais interagimos, compreendendo que nossa vida é enriquecida por um número maior de sujeitos do que costumamos perceber, nos auxilia a enriquecer nossas relações, a fortalecer nossos laços em uma perspectiva renovada, a cultivar relacionamentos mais profundos e a consolidar nossas conexões em uma nova dimensão."
      ] },

    { tipo: "leitura", fase: "fim", etiqueta: "Então…", titulo: "Não caia na falácia da solidão",
      blocos: [
        "No entanto, lembremos que, mesmo quando você esteja a quilômetros de distância de qualquer ser humano, seja fisicamente ou emocionalmente, sua pele, a luz, o vento, as suas lembranças, os objetos, aqueles que partiram e aqueles que ainda estão por vir, tudo isso está presente, junto a você.",
        "Não caia na falácia da solidão, que tanto repete e afirma que estamos muito sós, porque isso é a expressão do embrutecimento de nossa sensibilidade, não é expressão da realidade. A sua volta e dentro de você existem muitas e muitas formas de companhias, amizades e amores, basta apenas retomar sua atenção, não a deixar à mercê apenas das demandas exteriores. A partir dessa apropriação e orientação, é possível desfrutar uma forma de paraíso na terra ao entender que:",
        { destaque: "as relações podem ser infinitas, basta fazer amizade com o universo." }
      ] },

    { tipo: "mapa", modo: "final", fase: "fim", rotulo: "O tamanho do seu mundo", etiqueta: "O seu mapa", titulo: "O tamanho do seu mundo",
      blocos: ["Veja como o seu mapa ficou. O que você acrescentou na revisão aparece em outra cor."],
      avancar: "Continuar" },

    { tipo: "leitura", fase: "fim", rotulo: "Conduzir com outras pessoas", etiqueta: "Para quem conduz", titulo: "Para trabalhar com o instrumental",
      blocos: [
        "Você notou que o instrumental é baseado em perguntas, uma coisa simples, não é? Você também notou que as perguntas dão origem a novas perguntas? Essa percepção é de grande importância.",
        "Hoje em dia, é extremamente valioso incentivar as pessoas a formularem boas perguntas, mais do que respostas, inclusive. Em uma sociedade politicamente polarizada como a nossa, onde muitos estão focados apenas em afirmar seus próprios pontos de vista, as pessoas tendem a se fechar para novas perspectivas. Nesse contexto, uma boa pergunta pode ser uma poderosa forma de argumento, abrindo caminho para reflexões mais profundas e permitindo uma maior abertura para diferentes visões de mundo."
      ] },

    { tipo: "leitura", fase: "fim", etiqueta: "Para quem conduz", titulo: "Os princípios do instrumental",
      blocos: [
        "Neste momento, iremos falar especificamente sobre os fundamentos do instrumental. Esta discussão servirá especialmente para orientar como você poderá trabalhar com este instrumental, da maneira mais eficiente. Para começarmos, é importante termos em conta os princípios que fundamentam o instrumental “Mapeamento das Relações”. Podemos defini-los da seguinte maneira:",
        { lista: [
          "As perguntas formuladas têm o propósito de incitar outras perguntas e reflexões, não necessariamente respostas. Nesse sentido, o instrumental não é indicado para propostas que visem defender, afirmar ou reforçar posicionamentos, ideologias ou comportamentos;",
          "A abordagem do instrumental enfatiza especialmente o estímulo à curiosidade e à descoberta. Desse modo, o fascínio pelo espaço da incerteza prevalece sobre o apego à certeza;",
          "O espaço de reflexão proporcionado é inteiramente pessoal e intransferível, o que significa que as respostas não necessitam ser discutidas ou debatidas, mesmo em atividades em grupo. Cada indivíduo tem a oportunidade de refletir individualmente sobre as questões apresentadas. Nesse contexto, o espaço de reflexão é considerado como um lugar mais tranquilo e introspectivo, diferenciando-se do ambiente, às vezes mais agressivo, que se estabelece na defesa de conceitos e ideias;",
          "O objetivo da vivência é explorar a plasticidade emocional e estimular a abertura de novos horizontes, transcendendo a mera comprovação, identificação ou crítica. A meta principal é ampliar nossas perspectivas e possibilidades."
        ] },
        "Tendo isso em vista, você pode formular as perguntas segundo as necessidades que identificar."
      ] },

    { tipo: "leitura", fase: "fim", etiqueta: "Para quem conduz", titulo: "O que são boas perguntas?",
      blocos: [
        "O que importa é fazer boas perguntas. Mas, o que são boas perguntas?",
        "Boas perguntas são aquelas que desafiam o senso comum e estimulam o diálogo significativo. Elas são abertas e provocativas, permitindo que a pessoa explore suas ideias, opiniões e experiências de forma mais profunda. Boas perguntas podem ser surpreendentes, instigantes e ajudam a expandir o entendimento sobre um assunto. Algumas características das boas perguntas incluem:",
        { def: [
          ["Abrangência", "Elas são amplas o suficiente para abordar várias perspectivas e oferecer respostas diversificadas."],
          ["Profundidade", "Elas levam as pessoas a pensarem mais além do óbvio, a analisarem questões subjacentes e a considerarem possíveis consequências."],
          ["Abertura", "Elas não têm respostas simples ou binárias, mas incentivam a reflexão e a exploração de diferentes nuances."],
          ["Relevância", "Elas estão relacionadas aos interesses, conhecimentos e experiências do interlocutor."],
          ["Encorajamento", "Elas estimulam a expressão autêntica e genuína, encorajando as pessoas a compartilharem suas ideias e perspectivas sem medo de julgamentos."],
          ["Reflexão", "Elas podem ser filosóficas, instigando o indivíduo a examinar suas crenças e valores."],
          ["Contextualização", "Elas consideram o contexto e as circunstâncias em que estão sendo feitas."]
        ] },
        "Em suma, boas perguntas são poderosas ferramentas para a compreensão mútua e o enriquecimento do diálogo entre as pessoas."
      ] },

    { tipo: "leitura", fase: "fim", etiqueta: "Para quem conduz", titulo: "Sobre como replicar esse processo",
      blocos: [
        "Você pode conduzir todo o processo com as pessoas, da mesma maneira como foi feito aqui. É possível usar as mesmas perguntas, pois o material foi criado para ser facilmente replicado, mas também criar novas perguntas.",
        "Você pode optar por realizar apenas a etapa do Mapeamento das Relações, ou utilizar a seção do instrumental “Para Lembrar Como Brilho”, a escolha dependerá dos seus objetivos específicos.",
        "Você pode realizar essa jornada tanto em grupo quanto individualmente. O elemento-chave é proporcionar às pessoas envolvidas a oportunidade de refletir com tranquilidade e atenção sobre suas relações."
      ] },

    { tipo: "encerramento", fase: "fim", rotulo: "Finalização", etiqueta: "Finalização", titulo: "Finalização",
      paragrafos: [
        "Chegamos ao fim da nossa jornada, e espero que você tenha tido momentos significativos para reflexão e redefinição de sua relação com o mundo!!!",
        "Desejo que você tenha vislumbrado a oportunidade de expandir suas relações e formas de vínculo. No seu trabalho, torço para que você possa aplicar esse processo para incentivar as pessoas a se tornarem mais conscientes, e, como profissional, que colha frutos valiosos a partir disso.",
        "Muito obrigada pela confiança! Toda alegria do mundo para você!"
      ],
      assinatura: "Até breve!"
      /* convite: { titulo, texto, rotulo, href, externo }  ← GANCHO pra oficina "Mapeamento das relações" (a decidir) */
    }
  ]
};
