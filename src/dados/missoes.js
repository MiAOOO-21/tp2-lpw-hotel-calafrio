//Missões principais antes do Boss

const MISSOES = [
  {
    hospede: 'tiffany',
    pedido: [
      'Temos uma hóspede... exigente. A Madame Tiffany, no quarto à esquerda do corredor.',
      'Vá ver o que ela quer. Hóspede feliz é hóspede que fica. Para sempre.'
    ],
    objetivo: 'Fale com Madame Tiffany (quarto a oeste)'
  },
  {
    hospede: 'dancarina',
    pedido: [
      'A Dançarina do Pátio parou de dançar. Isso nunca é bom sinal por aqui.',
      'O pátio fica no alto, à esquerda. Siga o som da fonte.'
    ],
    objetivo: 'Fale com a Dançarina (pátio a noroeste)'
  },
  {
    hospede: 'chef',
    pedido: [
      'O Chef está desesperado com o banquete de hoje à noite.',
      'A cozinha fica no alto, à direita. Não mexa nas panelas.'
    ],
    objetivo: 'Fale com o Chef (cozinha a nordeste)'
  },
  {
    hospede: 'capitao',
    pedido: [
      'O Capitão do Bar anda mal-humorado. Diz que falta espírito no bar.',
      'O bar fica à direita do corredor. Espero que você tenha conversado com todo mundo...'
    ],
    objetivo: 'Fale com o Capitão (bar a leste)'
  },
  {
    hospede: 'porteiro',
    pedido: [
      'Você é mais esperto do que parece. Talvez seja hora de falar com o Porteiro da Noite.',
      'Ele fica perto da saída. Aquela porta que, curiosamente, nunca abre.'
    ],
    objetivo: 'Fale com o Porteiro da Noite (saguão, perto da saída)'
  }
]

// Falas da Dama da Vela
const FALAS_DAMA = {
  // Primeira conversa do jogo, antes da primeira missão
  boasVindas: [
    'Bem-vindo ao Hotel Calafrio! Seu quarto está pronto. Sempre esteve.',
    'Enquanto isso, que tal ajudar os nossos hóspedes? Eles adoram gente nova.'
  ],
  // Quando o jogador volta sem ter terminado a missão
  aindaNao: [
    'Ainda não resolveu? Os hóspedes não gostam de esperar.'
  ],
  // Quando o jogador volta com a missão cumprida
  agradecimento: [
    'Muito bem! Você está se ambientando rápido. Rápido até demais.'
  ],
  // Depois da última missão
  final: [
    'Você ajudou todos os hóspedes... O Mestre quer conhecer você pessoalmente.',
    'A porta dos aposentos, no topo do corredor, está aberta. Não o deixe esperando.'
  ],
  // Se falar com ela de novo quando a porta já está aberta
  lembrete: [
    'O Mestre está esperando. No topo do corredor.'
  ]
}

// Texto do objetivo no comecinho do jogo
const OBJETIVO_GERENTE = 'Fale com a Dama da Vela (recepção, no saguão)'
// Texto do objetivo quando é hora de voltar para a Dama
const OBJETIVO_VOLTAR = 'Volte à Dama da Vela (recepção, no saguão)'
// Texto do objetivo final
const OBJETIVO_MESTRE = 'Entre nos aposentos do Mestre (topo do corredor)'
