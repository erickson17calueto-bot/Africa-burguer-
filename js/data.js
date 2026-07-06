/* ============================================================
   ÁFRICA BURGER — DADOS DO SITE
   ------------------------------------------------------------
   Edite este ficheiro para alterar textos, preços, contactos,
   destinos e imagens SEM tocar no código do site.
   Preços em Kwanzas (número inteiro, sem pontos).
   ============================================================ */
window.AB_DATA = {

  brand: {
    nome: "África Burger",
    slogan: "Cada hambúrguer é um destino.",
    assinatura: "Sabores que contam histórias.",
    assinatura2: "Histórias que unem culturas.",
    quote: "Não é apenas comida. É uma viagem."
  },

  /* ⚠️ SUBSTITUIR pelo número real do WhatsApp da empresa
     (código do país + número, apenas dígitos) */
  contacto: {
    whatsapp: "244923456789",
    telefones: ["+244 923 456 789", "+244 923 456 780"],
    email: "geral@africaburger.ao",
    morada: ["Talatona, Luanda – Angola", "Rua KWN, Edifício África Burger"],
    horario: "Seg – Dom: 11h00 – 23h00",
    horarioExtra: "Entrega até às 23h30",
    mapaUrl: "https://maps.google.com/?q=Talatona,Luanda,Angola"
  },

  social: {
    instagram: "https://instagram.com/africaburger",
    facebook: "https://facebook.com/africaburger",
    tiktok: "https://tiktok.com/@africaburger",
    whatsapp: "https://wa.me/244923456789"
  },

  app: {
    googlePlay: "#",
    appStore: "#"
  },

  avaliacao: { nota: "4.8", texto: "de mais de 2.500 avaliações dos nossos viajantes" },

  stats: [
    { valor: "06", rotulo: "DESTINOS", sub: "Para explorar" },
    { valor: "12+", rotulo: "HAMBÚRGUERES", sub: "Sabores únicos" },
    { valor: "06", rotulo: "PAÍSES", sub: "Representados" },
    { valor: "100%", rotulo: "FEITO NA GRELHA", sub: "Sabor autêntico" }
  ],

  /* Tamanhos: acréscimo sobre o preço base de cada hambúrguer */
  tamanhos: [
    { id: "simples", nome: "Simples", extra: 0 },
    { id: "duplo",   nome: "Duplo",   extra: 1500 },
    { id: "gigante", nome: "Gigante", extra: 3300 }
  ],

  extras: [
    { id: "bacon",  nome: "Mais bacon",    preco: 600 },
    { id: "queijo", nome: "Queijo extra",  preco: 500 },
    { id: "carne",  nome: "Carne dupla",   preco: 1500 },
    { id: "ovo",    nome: "Ovo estrelado", preco: 400 },
    { id: "picante",nome: "Molho picante", preco: 300 }
  ],

  complementos: [
    { id: "batata", nome: "Batata rústica", preco: 1200, img: "assets/side-batata.png" },
    { id: "refri",  nome: "Refrigerante",   preco: 800,  img: "assets/side-refri.png" },
    { id: "molho",  nome: "Molho da casa",  preco: 400,  img: "assets/side-molho.png" }
  ],

  /* ------------------------------------------------------------
     DESTINOS / HAMBÚRGUERES
     img  : foto do hambúrguer (fundo escuro)
     video: vídeo do hambúrguer (mp4)
     ------------------------------------------------------------ */
  destinos: [
    {
      id: "luanda",
      cidade: "Luanda",
      pais: "Angola",
      bandeira: "🇦🇴",
      bandeiraCod: "ao",
      fundo: "assets/cidades/luanda.jpg",
      titulo: "O Clássico Angolano",
      coord: "8°50′S 13°14′E",
      preparo: "15–20 min",
      desc: "Inspirado na energia vibrante da capital angolana. Um clássico cheio de sabor, feito para conquistar.",
      descLonga: "Inspirado na energia vibrante da capital angolana, este hambúrguer combina sabor intenso e ingredientes seleccionados para conquistar o seu paladar. A brisa da Marginal entre dois pães brioche.",
      ingredientes: ["Pão brioche artesanal","Carne Angus 180g","Queijo cheddar","Bacon crocante","Cebola caramelizada","Molho especial África Burger","Alface americana","Tomate fresco","Picles artesanal"],
      preco: 3900,
      img: "assets/burger-dark.png",
      video: "assets/hero-video.mp4"
    },
    {
      id: "soweto",
      cidade: "Soweto",
      pais: "África do Sul",
      bandeira: "🇿🇦",
      bandeiraCod: "za",
      fundo: "assets/cidades/soweto.jpg",
      titulo: "O Braai de Soweto",
      coord: "26°16′S 27°51′E",
      preparo: "15–20 min",
      desc: "O espírito do braai sul-africano: fumo, brasa e alma. Um hambúrguer com a força de Soweto.",
      descLonga: "Nascido do fogo do braai, o churrasco que une famílias inteiras aos fins-de-semana. Blend grelhado sobre brasa viva, molho chakalaka picante e queijo gouda fumado — Soweto inteiro numa dentada.",
      ingredientes: ["Pão de milho tostado","Blend grelhado no braai","Molho chakalaka","Queijo gouda fumado","Cebola crocante","Alface fresca","Maionese de ervas"],
      preco: 4200,
      img: "assets/burger-dark.png",
      video: "assets/hero-video.mp4"
    },
    {
      id: "kigali",
      cidade: "Kigali",
      pais: "Ruanda",
      bandeira: "🇷🇼",
      bandeiraCod: "rw",
      fundo: "assets/cidades/kigali.jpg",
      titulo: "Mil Colinas",
      coord: "1°57′S 30°04′E",
      preparo: "15–20 min",
      desc: "Suave como as colinas de Kigali, com o toque secreto do akabanga — o famoso piri-piri ruandês.",
      descLonga: "Ruanda é a terra das mil colinas — e este hambúrguer sobe todas elas. Maionese de akabanga (o lendário óleo picante ruandês), banana-pão dourada e queijo suíço derretido em carne grelhada no ponto.",
      ingredientes: ["Pão brioche artesanal","Carne 180g","Maionese de akabanga","Banana-pão dourada","Queijo suíço","Rúcula","Tomate fresco"],
      preco: 4100,
      img: "assets/burger-dark.png",
      video: "assets/hero-video.mp4"
    },
    {
      id: "cairo",
      cidade: "Cairo",
      pais: "Egito",
      bandeira: "🇪🇬",
      bandeiraCod: "eg",
      fundo: "assets/cidades/cairo.jpg",
      titulo: "O Faraó",
      coord: "30°02′N 31°14′E",
      preparo: "15–20 min",
      desc: "Kofta especiada, tahine sedoso e hortelã fresca. Um hambúrguer digno dos faraós, à beira do Nilo.",
      descLonga: "Do coração do Cairo, uma kofta especiada com cominhos e coentros, coberta de tahine cremoso, picles de nabo e hortelã fresca. Cinco mil anos de história entre dois pães baladi tostados.",
      ingredientes: ["Pão baladi tostado","Kofta especiada 180g","Tahine cremoso","Picles de nabo","Tomate fresco","Hortelã fresca","Sumagre"],
      preco: 4300,
      img: "assets/burger-dark.png",
      video: "assets/hero-video.mp4"
    },
    {
      id: "zanzibar",
      cidade: "Zanzibar",
      pais: "Tanzânia",
      bandeira: "🇹🇿",
      bandeiraCod: "tz",
      fundo: "assets/cidades/zanzibar.jpg",
      titulo: "Rota das Especiarias",
      coord: "6°09′S 39°11′E",
      preparo: "15–20 min",
      desc: "A ilha das especiarias num hambúrguer: caril de coco, manga grelhada e o perfume do Índico.",
      descLonga: "Zanzibar foi durante séculos o centro do comércio de especiarias do Índico. Este hambúrguer celebra essa rota: carne temperada com especiarias da ilha, caril de coco cremoso, manga grelhada e coentros frescos.",
      ingredientes: ["Pão brioche artesanal","Carne com especiarias da ilha","Caril de coco","Manga grelhada","Queijo cheddar","Coentros frescos","Lima"],
      preco: 4500,
      img: "assets/burger-dark.png",
      video: "assets/hero-video.mp4"
    },
    {
      id: "dakar",
      cidade: "Dakar",
      pais: "Senegal",
      bandeira: "🇸🇳",
      bandeiraCod: "sn",
      fundo: "assets/cidades/dakar.jpg",
      titulo: "Teranga",
      coord: "14°42′N 17°28′O",
      preparo: "15–20 min",
      desc: "Teranga significa hospitalidade. Cebola yassa confitada e mostarda de lima — Dakar de braços abertos.",
      descLonga: "No Senegal, teranga é a arte de receber bem. Este hambúrguer recebe-o com cebola yassa confitada lentamente em lima e mostarda, banana-pão dourada e um blend suculento grelhado na hora. Bem-vindo a Dakar.",
      ingredientes: ["Pão artesanal","Blend 180g","Cebola yassa confitada","Mostarda de lima","Banana-pão","Alface crocante"],
      preco: 4400,
      img: "assets/burger-dark.png",
      video: "assets/hero-video.mp4"
    }
  ],

  sobre: {
    titulo1: "UMA VIAGEM",
    titulo2: "FEITA DE SABOR,",
    titulo3: "CULTURA E PAIXÃO.",
    paragrafos: [
      "A África Burger nasceu do desejo de criar mais do que hambúrgueres. Criamos experiências inspiradas em cidades reais, histórias verdadeiras e ingredientes selecionados.",
      "Cada receita é uma homenagem à diversidade africana. Cada mordida, uma conexão com o que nos torna únicos."
    ],
    chips: [
      { valor: "12+", rotulo: "HAMBÚRGUERES EXCLUSIVOS", sub: "Inspirados em cidades africanas" },
      { valor: "6",   rotulo: "DESTINOS ÚNICOS",         sub: "Sabores que atravessam fronteiras" },
      { valor: "100%",rotulo: "FEITO NA GRELHA",         sub: "Sabor autêntico em cada detalhe" },
      { valor: "🌿",  rotulo: "INGREDIENTES FRESCOS",    sub: "Selecionados de fornecedores locais" }
    ],
    historias: [
      { img: "assets/story-paixao.png",      alt: "Cozinheiros a preparar hambúrgueres na cozinha" },
      { img: "assets/story-dedicacao.png",   alt: "Carne a grelhar sobre fogo vivo" },
      { img: "assets/story-conexao.png",     alt: "Amigos a rir à volta de uma mesa" },
      { img: "assets/story-experiencia.png", alt: "Mãos a segurar um hambúrguer África Burger" }
    ]
  },

  newsletter: {
    eyebrow: "EXCLUSIVO PARA VIAJANTES",
    titulo: "RECEBA OFERTAS E NOVIDADES DIRETO NO SEU EMAIL",
    texto: "Promoções, novos hambúrgueres e destinos exclusivos. Não perca nada da sua viagem.",
    beneficios: [
      { icone: "%", titulo: "OFERTAS", sub: "EXCLUSIVAS" },
      { icone: "🍔", titulo: "LANÇAMENTOS", sub: "EM PRIMEIRA MÃO" },
      { icone: "🎁", titulo: "VANTAGENS", sub: "PARA VIAJANTES" }
    ]
  },

  confianca: [
    { titulo: "PAGAMENTO SEGURO",     sub: "Os seus dados estão protegidos" },
    { titulo: "ENTREGA RÁPIDA",       sub: "Chegamos até você com qualidade" },
    { titulo: "INGREDIENTES FRESCOS", sub: "Selecionados diariamente com rigor" },
    { titulo: "FEITO NA GRELHA",      sub: "Sabor e suculência únicos" },
    { titulo: "FEITO COM PAIXÃO",     sub: "Cada pedido é preparado com dedicação" }
  ]
};
