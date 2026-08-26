/* ============================================================================
   PERCURSO: PONTE — conteúdo
   Fonte única de verdade: "PONTE Revisado.docx" (Elaine Narcizo, rev. ago/2026).
   ----------------------------------------------------------------------------
   🔑 Este arquivo é SÓ CONTEÚDO. O motor (../_motor/motor.js) não sabe nada
   sobre a Ponte — ele lê esta estrutura. Para criar OUTRO percurso: nova pasta
   em /percurso/<nome>/ com um index.html igual e o seu próprio dados.js.
   ============================================================================ */

window.PERCURSO = {

  id: "ponte",
  nome: "Ponte",
  subtitulo: "percurso para elaboração de projetos de vida",
  autora: "Elaine Narcizo",
  versao: 2,                       /* ⚠️ subir isto invalida o progresso salvo */

  capa: {
    video: "/assets/video/ponte-capa.mp4",
    poster: "/assets/video/ponte-capa.jpg",
    chamada: "Uma ponte entre o presente e o que se deseja alcançar.",
    tempo: "3 exercícios · no seu ritmo",
    entrar: "Começar o percurso",
    retomar: "Continuar de onde parei"
  },

  /* ---- 1. Abertura (carta de boas-vindas) --------------------------------- */
  abertura: {
    etiqueta: "Boas-vindas",
    saudacao: "Olá! Desejo que esteja bem.",
    paragrafos: [
      "É com grande alegria que apresento esta atividade, e é uma satisfação poder contar com sua presença neste percurso! Minha expectativa é que este percurso se torne um espaço significativo de reflexão e transformação, capaz de contribuir de maneira concreta para seus projetos pessoais e profissionais.",
      "Esta metodologia foi desenvolvida ao longo de anos e se tornou muito interessante para o trabalho com pessoas ou grupos, especialmente em contextos voltados ao desenvolvimento de projetos de vida. Mais do que planejar o futuro, esta proposta convida à construção de uma ponte entre o presente e o que se deseja alcançar, fortalecendo a capacidade de ação a partir de escolhas menos solitárias, mais atentas e belas.",
      "Sempre é um desafio trabalhar projetos de vida — acredito que essa experiência pode ser especialmente valiosa!"
    ],
    assinatura: "Elaine Narcizo",
    avancar: "Continuar"
  },

  /* ---- 2. Por que planejar ------------------------------------------------ */
  porque: {
    etiqueta: "Antes de começar",
    titulo: "Planejar não é privilégio de quem já se organizou.",
    paragrafos: [
      "A ação de planejar muitas vezes é associada a pessoas tidas como evoluídas, altamente organizadas e orientadas para execução de metas, como se esta fosse uma habilidade reservada a uns poucos privilegiados, não é mesmo? Essa visão se deve muito à falta de compreensão do valor intrínseco do planejamento, que extrapola questões relacionadas à simples busca pelo sucesso.",
      "Nesta jornada, teremos a oportunidade de explorar aspectos do planejamento de uma maneira mais interessante, transcendendo a mera definição de metas pessoais. Vamos experimentar e desenvolver um planejamento que nos auxilie a ampliar nossas relações interpessoais, que nos ajude a compreender a verdadeira essência da satisfação profunda e da alegria de conviver.",
      "Espero sinceramente que essa abordagem lhe traga muitas realizações pessoais e em seus trabalhos!"
    ],
    avancar: "Como funciona"
  },

  /* ---- 3. Objetivo + como funciona ---------------------------------------- */
  comoFunciona: {
    etiqueta: "O percurso",
    titulo: "Como isto funciona.",
    objetivo: {
      pergunta: "Qual o objetivo do percurso?",
      resposta: "Refletir sobre as diferentes dimensões da sua vida no presente, definir seus objetivos futuros e criar uma ponte de ação para alcançá-los — sobretudo a partir da retomada de consciência sobre o presente e do aprimoramento da atenção."
    },
    processo: {
      pergunta: "Como funcionará o processo?",
      resposta: "A metodologia sugere que você passe por todo o processo. Em primeiro lugar, isso é valioso para a sua vida pessoal. Em segundo lugar, essa vivência permitirá que você adquira um conhecimento mais sólido sobre o tema, tornando-se capaz de realizar o trabalho com outras pessoas com mais propriedade."
    },
    papel: {
      titulo: "Papel e caneta, se puder.",
      texto: "Nós utilizaremos como materiais apenas folhas em branco, caneta ou lápis. Seria mais proveitoso para você escrever à mão: a escrita com a mão, ou qualquer forma de trabalho manual, sempre é uma forma de intensificar nossa presença e retomar nossa atenção e foco. Além disso, escrever à mão lhe conecta melhor com você mesma.",
      nota: "Aqui você pode fazer dos dois jeitos. Escreva direto na tela, ou escreva no papel e apenas marque “fiz no papel” para seguir. O percurso guarda o seu progresso dos dois modos."
    },
    etapas: "O processo será dividido em três etapas, cada etapa contempla um exercício. Todos eles têm por objetivo inspirar levantamentos e reflexões que abasteçam e orientem a elaboração do seu projeto de vida.",
    avancar: "Vamos começar?"
  },

  /* ---- Os 3 exercícios ---------------------------------------------------- */
  exercicios: [
    {
      id: "presente",
      numero: "01",
      cor: "#81bb4b",
      titulo: "a presença como presente",
      chamada: "Um inventário do que você já é.",
      ensaio: {
        titulo: "Por que começar pelo que já existe.",
        paragrafos: [
          "Vamos começar nosso processo observando seu momento atual. Para isso, iremos realizar um inventário do seu presente — um levantamento sobre o que você já conquistou até aqui.",
          "Por que isso é importante? Essencialmente porque com frequência negligenciamos nossas conquistas e nosso repertório, e isso resulta na subvalorização dos recursos que já temos disponíveis. Não é raro que desconsideremos nossos talentos, conquistas e habilidades. O pior é que isso gera uma angústia constante, a sensação de sempre precisar de mais, de saber mais e de ainda não estar tão preparada.",
          "Rever essas questões não é apenas um exercício crítico sobre nós mesmas, mas principalmente uma oportunidade de avaliar o que podemos fazer por nós, em nosso contexto de vida, a partir dos recursos que já possuímos há bastante tempo."
        ],
        provocacao: {
          titulo: "Para ponderar",
          texto: "Pense em algum sonho intenso e específico que você teve na vida. Ao olhar para isso, o que você sente? Acredita que poderia tê-lo realizado? Por que não o fez? Por que não o faz agora — talvez não da mesma maneira, mas de uma forma que ainda seja possível?",
          itens: [
            "Trata-se de autossabotagem?",
            "Acomodação?",
            "Falta de companhia?",
            "Falta de foco?",
            "Deixar-se conduzir por demandas externas que não refletem as suas prioridades?"
          ]
        }
      },
      ritual: {
        titulo: "Antes de escrever, uma canção.",
        texto: "Para iniciar a atividade, sugiro que escute a canção “Aqui e Agora”, de Gilberto Gil. Caso seja possível, vá para um lugar tranquilo e relaxe escutando a canção.",
        link: "https://www.youtube.com/watch?v=cC1ntip1f_U",
        linkRotulo: "Ouvir “Aqui e Agora” — Gilberto Gil"
      },
      instrucao: "Descreva de maneira detalhada como estão as seguintes áreas da sua vida. É muito importante que você não se concentre apenas nos aspectos negativos — raramente tudo está perfeito ou completamente terrível. Empenhe-se em reconhecer as realizações positivas da sua trajetória: é provável que você tenha conquistado, aprendido e ajudado muito mais do que imagina.",
      campo: "presente"
    },
    {
      id: "futuro",
      numero: "02",
      cor: "#6132a5",
      titulo: "o futuro é ancestral",
      chamada: "O que você não deseja para o seu futuro.",
      credito: "Obras: Jaider Esbell · Título inspirado no livro de Ailton Krenak",
      ensaio: {
        titulo: "O futuro não é totalmente novo.",
        paragrafos: [
          "“O Futuro é Ancestral” é o título de um livro de Ailton Krenak, cuja leitura recomendo fortemente. Ao pensarmos no futuro, geralmente associamos concepções relacionadas a invenções, inovações e tecnologias avançadas. Embora isso seja real, não é o único nem o aspecto mais importante.",
          "O futuro não é totalmente novo como parece. Nele estão implicitamente presentes nosso passado e nosso presente. Muitas das fundações do futuro provêm do passado: grande parte do futuro é sustentada pelo que foi preservado, não pelo que foi inventado.",
          "Ao considerarmos o que não desejamos para o nosso futuro, abrimos espaço para uma análise profunda de nossas preferências, limites e valores no agora. Identificar claramente o que queremos preservar e o que queremos evitar fornece concepções muito melhores sobre nossas prioridades e motivações.",
          "Isso não significa adotar uma postura negativista ou pessimista; pelo contrário, é uma estratégia esclarecedora. Ao afastar o que não desejamos, abrimos espaço para a realização dos sonhos de maneira mais consistente."
        ]
      },
      instrucao: "Levando essa reflexão em consideração, descreva agora o que você NÃO deseja para o seu futuro, em cada uma das áreas.",
      campo: "futuro"
    },
    {
      id: "ponte",
      numero: "03",
      cor: "#df5338",
      titulo: "ponte para elaboração de projetos de vida",
      chamada: "Ações concretas, hoje, com o que você já tem.",
      ensaio: {
        titulo: "As boas notícias que podemos dar a nós mesmas.",
        paragrafos: [
          "Nesta etapa, concentraremos nossos esforços em estabelecer uma conexão dinâmica e efetiva entre o presente e o futuro. É na fase que chamamos de “Ponte” que reside o verdadeiro cerne do projeto de vida, pois é ela que determina a consistência do processo.",
          "É importante compreender que agir de acordo com seus sonhos não precisa se limitar ao enfrentamento de adversidades. Por que não podemos encarar nosso processo de desenvolvimento com a alegria que envolve a exploração de novas descobertas, como um exercício de curiosidade e de aprendizagem? Essa perspectiva coloca mais ênfase na nossa capacidade de observação e atenção do que no esforço e na superação das dificuldades.",
          "Você elaborou o inventário do seu presente e refletiu sobre o que não deseja para o seu futuro. Podemos destacar, como aspecto fundamental, a importância de permanecer atenta — observando não somente os déficits e as necessidades, mas sobretudo suas potencialidades."
        ]
      },
      instrucao: "Descreva as ações necessárias para alcançar seus objetivos. Ancore-as no que você levantou nos fundamentos: as relações que listou, os grupos que despertam seu interesse, e as formas de produzir beleza que descobriu.",
      campo: "ponte"
    }
  ],

  /* ---- As 11 áreas da vida (percorridas nos 3 exercícios) ----------------- */
  areas: [
    {
      id: "saude", nome: "Saúde",
      presente: "Reflita sobre o estado atual da sua saúde física e mental. Como se sente em termos de energia, bem-estar geral e hábitos de vida? Quais hábitos, mesmo sem você perceber, auxiliam na manutenção da sua saúde física e emocional?",
      futuro: "O que você não deseja para a sua saúde no futuro?",
      ponte: "Pense em ações específicas que você pode estabelecer no presente para aprimorar seu bem-estar, conviver melhor e sentir mais prazer e satisfação.",
      sugestoes: [
        "Organizar leituras de seu interesse — artigos, livros, histórias em quadrinhos. Caso não tenha o hábito, comece devagar, mas comece.",
        "Relembrar sua juventude e extrair dela elementos valiosos: a ousadia, a coragem, a esperança.",
        "Participar de atividades voluntárias ao menos uma vez por ano.",
        "Dedicar-se a uma atividade artística simples e regular — desenhar, pintar, bordar. O importante é produzir com as mãos."
      ]
    },
    {
      id: "familia", nome: "Família",
      presente: "Considere suas relações familiares no presente. Como está a qualidade dessas relações? Você está satisfeita com o equilíbrio entre sua vida familiar e suas outras responsabilidades? O que pode destacar de positivo? Caso não seja próxima de seus familiares, como isso a ajudou?",
      futuro: "O que você não deseja para as suas relações familiares no futuro?",
      ponte: "Pense em ações que possam reforçar seus laços familiares, ou resolver questões pendentes.",
      sugestoes: [
        "Explorar estratégias de comunicação eficaz — conhecer a comunicação não violenta e a escuta ativa.",
        "Investir em formas de desenvolver o apoio mútuo: receber ajuda e apoiar de maneira fluida."
      ]
    },
    {
      id: "amizades", nome: "Amizades",
      presente: "Como estão suas relações de amizade? Você está satisfeita com a qualidade dessas relações? Durante a vida, muitos amigos vão e partem, outros permanecem e muitos estão por chegar. O que essa dinâmica ensinou de importante para você até aqui?",
      futuro: "O que você não deseja para as suas amizades no futuro?",
      ponte: "Considere maneiras de cuidar e fortalecer suas amizades no presente.",
      sugestoes: [
        "Ampliar sua rede de amizades para além das relações humanas — plantas, animais, estações do ano, literatura, filosofia.",
        "Praticar a meditação e a autoconsciência como um gesto de amizade consigo mesma.",
        "Realizar atividades físicas como uma relação de amizade e confiança com seu corpo.",
        "Participar de eventos e atividades culturais, como uma amizade mais próxima com sua sensibilidade."
      ]
    },
    {
      id: "emprego", nome: "Emprego",
      presente: "Analise sua situação profissional atual — caso esteja desempregada, relate também sobre isso. O que o trabalho significa para você, especialmente em termos positivos? Há oportunidades de crescimento que você pode aproveitar melhor?",
      futuro: "O que você não deseja para a sua vida profissional no futuro?",
      ponte: "Pense em como você pode progredir em direção aos seus objetivos profissionais, no momento atual.",
      sugestoes: [
        "Expandir sua rede de contatos e conhecer melhor o que seu contexto lhe oferece.",
        "Aprender outra língua, por meio de aplicativos, estudos autodidatas, filmes e músicas.",
        "Ampliar seu repertório cultural relacionado ao mundo do trabalho.",
        "Realizar teste vocacional — isso não se restringe aos jovens; em qualquer momento da vida podemos pensar uma transição de carreira.",
        "Procurar ajuda profissional para conversar sobre sua carreira e seus sonhos relacionados ao trabalho."
      ]
    },
    {
      id: "sonho", nome: "Sonho",
      presente: "Pense em seus sonhos e aspirações. O que você já alcançou? Existe algo específico que esteja trabalhando para realizar neste momento?",
      futuro: "O que você não deseja para os seus sonhos — o que faria com que eles se esvaziassem?",
      ponte: "Identifique passos concretos que você pode dar no presente para caminhar em direção aos seus sonhos.",
      sugestoes: [
        "Reflita com carinho sobre seus sonhos de infância — não apenas para revivê-los, mas para reencontrar sentimentos importantes como a ternura, a doçura e a simplicidade.",
        "Convide as pessoas que você ama a participar de ações relacionadas a esses sonhos. Faça convites, envolva outras pessoas na conquista dos seus sonhos."
      ]
    },
    {
      id: "financeira", nome: "Vida financeira",
      presente: "Como está sua vida financeira? Você tem enfrentado desafios? É organizada e tem controle sobre essa dimensão? O que a superação de obstáculos nesse campo trouxe de aprendizado importante, que a ajuda a lidar com os problemas hoje?",
      futuro: "O que você não deseja para a sua vida financeira no futuro?",
      ponte: "Identifique passos concretos que você pode tomar agora para progredir em direção à sua organização.",
      sugestoes: [
        "Estabelecer um orçamento claro e acompanhar seus gastos regularmente.",
        "Economizar uma porcentagem específica da renda regularmente — isso tem mais a ver com um aprendizado do que com guardar dinheiro. Pode começar com R$ 5,00 por mês; o que interessa é aprender a fazer.",
        "Investir em sua educação financeira: livros, cursos, aconselhamento.",
        "Definir metas financeiras de curto e longo prazo.",
        "Avaliar suas dívidas atuais e criar um plano para reduzi-las progressivamente.",
        "Pensar formas de ganhar dinheiro de maneira coparticipativa e/ou cooperativa."
      ]
    },
    {
      id: "educacao", nome: "Educação e desenvolvimento",
      presente: "Avalie seu comprometimento com o aprendizado contínuo e o desenvolvimento pessoal. Há áreas específicas em que gostaria de expandir seu conhecimento? Como todas as formas de educação a que teve acesso — familiar, escolar, de convivência — a fortaleceram até aqui?",
      futuro: "O que você não deseja para o seu desenvolvimento no futuro?",
      ponte: "Pense em formas de se desenvolver de maneira ampla e objetiva.",
      sugestoes: [
        "Invista em áreas específicas nas quais gostaria de expandir seu conhecimento.",
        "Procure cursos online gratuitos.",
        "Pesquise sobre universidades e intercâmbios, inclusive em outros países.",
        "Verifique todas as oportunidades na sua cidade — universidades, cursos técnicos.",
        "Dedique um tempo para entender as tendências do mercado profissional para o futuro."
      ]
    },
    {
      id: "lazer", nome: "Lazer e recreação",
      presente: "Considere como você utiliza seu tempo de lazer. Quais são seus hobbies e atividades recreativas favoritas? Essas atividades contribuem positivamente para o seu bem-estar?",
      futuro: "O que você não deseja para o seu lazer no futuro?",
      ponte: "Considere como você utiliza seu tempo de lazer — e o que gostaria de mudar nisso.",
      sugestoes: [
        "Seus hobbies são sempre os mesmos? O que poderia acontecer se você ampliasse essas possibilidades?",
        "Essas atividades realmente proporcionam descanso e renovação de energia? Ou são sempre algo que causa gastos e cansaço?",
        "Como é possível se divertir sem ter que gastar dinheiro?",
        "Você consegue ficar sem fazer nada, lida bem com o ócio? O que isso significa?"
      ]
    },
    {
      id: "comunidade", nome: "Engajamento comunitário",
      presente: "Pondere sobre sua participação na comunidade e em atividades coletivas. De que maneira você já contribuiu ou contribui para o bem-estar da sua comunidade?",
      futuro: "O que você não deseja para a sua relação com a comunidade no futuro?",
      ponte: "Pondere sobre como potencializar sua participação na comunidade e em atividades voluntárias.",
      sugestoes: [
        "Pense maneiras de contribuir com o bem-estar da sua comunidade.",
        "Avalie quais aprendizados poderá adquirir participando da vida comunitária."
      ]
    },
    {
      id: "equilibrio", nome: "Equilíbrio e autocuidado",
      presente: "Avalie como está o equilíbrio entre suas diversas responsabilidades. Você está dedicando tempo suficiente para o autocuidado e o descanso?",
      futuro: "O que você não deseja para o seu equilíbrio e autocuidado no futuro?",
      ponte: "Descreva formas de melhorar sua autoestima, conhecimento pessoal e equilíbrio emocional.",
      sugestoes: [
        "Aproveite melhor os espaços públicos.",
        "Convide pessoas de outras gerações, mais jovens e mais velhas, para passar um tempo juntas. É importante que não sejam apenas pessoas da família."
      ]
    },
    {
      id: "tecnologia", nome: "Tecnologia e conexão social",
      presente: "Descreva como você utiliza a tecnologia na sua vida diária. Essa utilização contribui para conexões sociais positivas, ou pode estar impactando negativamente sua qualidade de vida?",
      futuro: "O que você não deseja para a sua relação com a tecnologia no futuro?",
      ponte: "Pense em estratégias que a auxiliem a utilizar a tecnologia da melhor forma.",
      sugestoes: [
        "Pense como a tecnologia pode ser utilizada a seu favor — no emprego, na formação cultural e política.",
        "Estabeleça metas de uso, e utilize outros meios de interação que não se limitem ao celular."
      ]
    }
  ],

  /* ---- Fundamentos (antes das ações do exercício 3) ----------------------- */
  fundamentos: {
    etiqueta: "Antes da Ponte",
    titulo: "Três fundamentos.",
    intro: "A Ponte só fica de pé sobre relações cultivadas, presença em grupos e uma certa beleza necessária. Antes de listar ações, dedique alguns minutos a cada um destes fundamentos — este será o material de vida que vai orientar o seu projeto.",
    itens: [
      {
        id: "relacoes",
        numero: "1",
        eyebrow: "Sem relações, não existem os sonhos.",
        titulo: "Quem estará ao meu lado?",
        paragrafos: [
          "Um dos desafios mais sérios para elaborar um projeto é a crença equivocada de que ele é uma jornada puramente individual. A ideia de que o destino está unicamente em nossas mãos é frequentemente responsável pelo fracasso de muitos projetos de vida.",
          "Ao examinar o seu projeto, é fundamental se indagar: quem estará ao meu lado? Para quem, além de mim mesma, é direcionado todo esse esforço? É a qualidade das interações que sustenta um projeto de vida promissor. As relações representam o combustível essencial para nossa potência de ação."
        ],
        tarefas: [
          "Faça uma lista das relações mais significativas em sua vida.",
          "Identifique aquelas das quais você jamais abriria mão.",
          "Considere também outras formas de conexão — o mar, o amanhecer, a música, o tempo livre."
        ],
        placeholder: "Liste, sem ordem, o que vier à mente…"
      },
      {
        id: "grupos",
        numero: "2",
        eyebrow: "Estar junto, para ser maior.",
        titulo: "Em que grupos você quer estar?",
        paragrafos: [
          "Participar de grupos e evitar o isolamento não apenas amplia horizontes, mas confere materialidade e objetividade ao seu projeto — através da interação torna-se possível mapear e vislumbrar de forma mais clara as oportunidades presentes no seu contexto de vida.",
          "Geralmente associamos o desenvolvimento à necessidade de acesso a novas oportunidades. No entanto, negligenciamos um ponto fundamental: as oportunidades não são apenas criadas, também podem ser reconhecidas. Isso está mais relacionado à interação e ao pertencimento do que à inovação."
        ],
        tarefas: [
          "Elabore uma lista de atividades coletivas que despertem seu interesse. A simples pesquisa na sua comunidade já é uma etapa significativa.",
          "Valorize a participação em grupos diferentes dos que você está acostumada — isso abre novas perspectivas."
        ],
        placeholder: "Grupos, coletivos, atividades — mesmo os que você ainda não frequenta…"
      },
      {
        id: "criatividade",
        numero: "3",
        eyebrow: "Criatividade e imaginação.",
        titulo: "O que seria ousado demais?",
        paragrafos: [
          "Com frequência subestimamos o papel vital desempenhado pela criatividade e pela imaginação. Quando abrimos mão delas, ficamos suscetíveis a desejar coisas que não nos dizem respeito e a sonhar sonhos que não são genuinamente nossos. Tornamo-nos simples cumpridores de tarefas.",
          "Essa renúncia resulta na perda de sentido do projeto de vida — muitas vezes disfarçada pela gradual falta de interesse ou pela procrastinação. A imaginação e a criatividade são o que possibilita sermos autênticas, e sermos autênticas é a melhor forma de nos reconectarmos conosco."
        ],
        tarefas: [
          "Em cada etapa que você preencherá, coloque ao menos uma proposta altamente inusitada, criativa e ousada.",
          "Use a imaginação para pensar parcerias, experimentar coisas novas, buscar opções que nunca imaginou — outros países, cidades, lugares que nunca pensou em conhecer."
        ],
        placeholder: "As ideias ousadas, as que você não contaria pra qualquer um…"
      },
      {
        id: "beleza",
        numero: "4",
        eyebrow: "A beleza necessária.",
        titulo: "Onde colocar mais beleza?",
        paragrafos: [
          "Para que um projeto de vida seja consistente, é importante cultivar relacionamentos, estar em grupos e desenvolver a criatividade — mas tudo isso demanda algo raro hoje em dia: a intensificação da presença. Para isso temos uma ferramenta valiosa: a produção de beleza.",
          "A beleza não é apenas um atributo estético, mas uma experiência e produção de vida. É fundamental que você sinta que está criando algo belo, significativo, que a faça se surpreender consigo mesma. Um projeto de vida não pode ser desprovido de beleza, pois ao longo do tempo ele esvaziaria seu sentido — somos movidos por coisas belas."
        ],
        tarefas: [
          "Faça uma lista de ações factíveis para colocar mais beleza no seu contexto de vida e no mundo.",
          "Plantar uma árvore por ano? Escrever cartas para contar sobre seu projeto de vida? Enfeitar sua casa? Dançar todos os dias músicas que você ama e nunca dançou? Olhar o céu?"
        ],
        placeholder: "Coisas factíveis, razoáveis e práticas…"
      }
    ],
    avancar: "Atravessar para as ações"
  },

  /* ---- Síntese (as três colunas prontas) ---------------------------------- */
  sintese: {
    etiqueta: "Síntese",
    titulo: "Presente · Futuro · Ponte",
    parabens: "Primeiramente, parabéns!",
    paragrafos: [
      "Você produziu um material que aborda aspectos fundamentais da sua vida, e isso traz contribuições significativas. Passamos a vida inteira sem fazer isso — e fazer pode simplesmente mudar os tempos e as possibilidades da vida, de maneira objetiva.",
      "Em segundo lugar: agora você tem outra coisa a que se dedicar daqui para frente."
    ],
    avancar: "O que fazer agora"
  },

  /* ---- Transformar a Ponte em ações reais --------------------------------- */
  acoesReais: {
    etiqueta: "O passo que fica",
    titulo: "A Ponte precisa virar calendário.",
    paragrafos: [
      "O item Ponte precisa ser transformado em ações reais. Isso significa detalhar de forma clara e objetiva o que você quer e pode fazer. Para isso, é importante que você elabore calendários, pense em datas e na dinâmica de suas ações. Coloque esse material em algum lugar de fácil acesso, que você lembre.",
      "Não adianta muito chegar até aqui e não fazer esta etapa — porque não é somente uma questão de planejamento objetivo: é com esta dedicação que você realmente começa a colocar em andamento o seu projeto de vida.",
      "Estabeleça prazos realistas e siga-os. No início é provável que você esteja bastante motivada, mas ao longo do tempo pode haver momentos em que diminuirá o ritmo, ou até deixará de lado o planejamento. Isso é normal e, na verdade, saudável — aponta que você está em processo de adaptação e ressignificação."
    ],
    destaque: "A chave aqui é não desistir: volte sempre ao seu planejamento, ajuste-o e cumpra-o conforme for possível. Uma ação realizada já é muito diferente de nenhuma. A perseverança não exige manter um ritmo constante, mas permanecer.",
    avancar: "Fazer o compromisso"
  },

  /* ---- Compromisso -------------------------------------------------------- */
  compromisso: {
    etiqueta: "Compromisso",
    titulo: "Uma declaração para si — e para alguém de confiança.",
    intro: "Vamos finalizar este percurso com a efetivação de um compromisso pessoal? Escreva uma declaração que defina seu planejamento. Mantenha-se focada e revisite-a periodicamente para garantir que esteja progredindo em direção aos seus objetivos.",
    placeholder: "Eu me comprometo a…",
    destaque: "Agora, o mais importante: dê ou envie uma cópia desta carta de compromisso para alguém de confiança. O objetivo é que você tenha companhia, e também possa ser acompanhada. Isso pode ajudar muito você a cumprir seus objetivos.",
    avancar: "Encerrar o percurso"
  },

  /* ---- Encerramento (carta final) ---------------------------------------- */
  encerramento: {
    etiqueta: "Até a próxima",
    titulo: "Foi uma jornada intensa, não é mesmo?",
    paragrafos: [
      "Durante todo esse processo, experimentamos uma série de sentimentos, emoções, memórias e aprendizados. Espero que você tenha se reconectado com a riqueza que permeia a sua vida. Espero que tenha compreendido a importância de valorizar os seus tesouros e percebido que o futuro é inspirado pelo presente.",
      "No seu trabalho, desejo que consiga estabelecer processos significativos nos quais as pessoas possam reconhecer sua própria inteligência, capacidade e coragem.",
      "Agradeço sinceramente por ter participado desta jornada — é uma honra poder fazer isso junto com você. Até a próxima, e que, até lá, os dias sejam repletos de sentido e cores! Um caloroso abraço!"
    ],
    assinatura: "Com carinho, Elaine Narcizo."
  },

  /* ---- Apêndice: conduzir com outras pessoas ------------------------------ */
  facilitar: {
    etiqueta: "Apêndice",
    titulo: "Conduzir este percurso com outras pessoas.",
    intro: "Orientações da Elaine para quem for trabalhar este processo com pessoas, grupos ou comunidades.",
    paragrafos: [
      "Este processo completo pode ser conduzido ao longo de várias sessões ou encontros, sendo possível estabelecer um prazo antecipado com os participantes, dependendo de suas demandas e disponibilidades. A parte dos levantamentos, das listas e reflexões é intrinsecamente produtiva — mas quando há trocas e diálogos entre os participantes, as coisas se tornam mais claras e ricas.",
      "É altamente eficaz, se possível, que você acompanhe o cronograma das atividades por algum tempo, de maneira próxima. Isso auxilia as pessoas a se manterem motivadas mesmo diante de desafios e facilita o processo de adaptação, especialmente porque elas têm com quem desabafar, tirar dúvidas e compartilhar conquistas. A celebração é um elemento fundamental — não apenas como motivação, mas como verificação da própria capacidade de agir.",
      "Vivemos em uma sociedade marcada pela ansiedade e pela pressa. Auxiliar as pessoas a pensarem a longo prazo, manterem-se firmes em seus propósitos e lidarem bem com suas limitações é uma questão fundamental no projeto de vida. Antes de mais nada, é necessário ter companhia, poder conversar, compartilhar as belezas e sentir-se apoiada diante das limitações impostas.",
      "Não há restrição de público e idade para a realização deste processo. A única consideração é adaptar as atividades de acordo com as demandas e necessidades das pessoas que participarão."
    ]
  }
};
