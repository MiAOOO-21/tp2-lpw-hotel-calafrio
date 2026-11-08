/* Personagens */

const PERSONAGENS = {

    // A gerente do hotel. As falas dela ficam em missoes.js, porque mudam conforme o andamento das missões
    dama: {
        nome: 'Dama da Vela',
        textura: 'npc_dama'
    },

    // MISSÃO 1 - desafio de BUSCA (andar pelo mapa e achar coisas)
    tiffany: {
        nome: 'Madame Tiffany',
        textura: 'npc_tiffany',
        falaComum: [
            'Querido, você viu meu carro importado? Faz curvas lindas... e a minha cabeça faz mais curvas ainda.'
        ],
        falaDesafio: [
            'Ah, finalmente alguém! Dei uma festinha com meus muitos, muitos "amigos"...',
            'E espalhei minhas TRÊS taças de champanhe rosa pelo hotel. Traga-as de volta, sim?'
        ],
        desafio: { tipo: 'busca', quantidade: 3 },
        falaVitoria: [
            'Minhas tacinhas! Champanhe rosa, bem geladinho. Leve umas garrafas para você.',
            'Um gole cura qualquer ferida. Pelo menos as de fora.'
        ],
        recompensa: { atributo: 'champanhes', valor: 3, mensagem: '+3 CHAMPANHE ROSA (cura na batalha)' },
        falaDepois: ['Cuidado com os espelhos do teto, querido. Eles lembram de tudo.']
    },

    // MISSÃO 2 - desafio de MEMÓRIA (repetir a sequência de passos)
    dancarina: {
        nome: 'Dançarina do Pátio',
        textura: 'npc_dancarina',
        falaComum: [
            'Aqui no pátio a gente dança suado, noite após noite.',
            'Tem gente que dança para lembrar de algo. Tem gente que dança para esquecer. Eu danço para esquecer a conta do frigobar.'
        ],
        falaDesafio: [
            'Dancei tanto para esquecer que... esqueci a coreografia!',
            'Eu mostro os passos, você repete com as SETAS do teclado. Combinado?'
        ],
        desafio: { tipo: 'memoria', titulo: 'Os Passos Esquecidos', rodadas: [3, 4, 5] },
        falaVitoria: ['Isso! Com esse gingado, ninguém te acerta de jeito.'],
        recompensa: { atributo: 'defesa', valor: 3, mensagem: '+3 DEFESA (Gingado do Pátio)' },
        falaDepois: ['Lembra do passo para a esquerda quando a Fera atacar!']
    },

    // MISSÃO 3 - desafio de REFLEXO (apertar na hora certa)
    chef: {
        nome: 'Chef dos Aposentos',
        textura: 'npc_chef',
        falaComum: [
            'Toda noite tem banquete nos aposentos do Mestre. Eu só cozinho, não pergunte o que vai na panela.'
        ],
        falaDesafio: [
            'Minhas facas estão cegas e o banquete é hoje! Me ajuda a afiar?',
            'Aperte ESPAÇO quando o marcador passar pela faixa verde. Três acertos e pronto.'
        ],
        desafio: { tipo: 'reflexo', titulo: 'Afiando as Facas', acertosNecessarios: 3 },
        falaVitoria: [
            'Perfeitas! Fique com esta faca de aço, você mereceu.',
            'Mas vou te contar um segredo: aço nenhum mata a Fera. Já tentaram. Muitas vezes.'
        ],
        recompensa: { atributo: 'ataque', valor: 6, mensagem: '+6 ATAQUE (Faca de Aço)' },
        falaDepois: ['Faca de aço arranha, mas não derruba. Para a Fera, precisa de outra coisa.']
    },

    // MISSÃO 4 - desafio de QUIZ (as respostas estão nas conversas!)
    capitao: {
        nome: 'Capitão do Bar',
        textura: 'npc_capitao',
        falaComum: [
            'Vinho? Ih... esse tal espírito sumiu daqui em 1969 e nunca mais deu as caras.'
        ],
        falaDesafio: [
            'Quer que o espírito volte para este bar? Então prove que prestou atenção nos hóspedes.',
            'Três perguntas. Errou, tenta de novo. Acertou todas, eu abro a garrafa especial.'
        ],
        desafio: {
            tipo: 'quiz',
            titulo: 'O Quiz do Capitão',
            perguntas: [
                {
                    pergunta: 'Em que ano o Veterano fez check-in no hotel?',
                    opcoes: ['1959', '1969', '1979'],
                    correta: 1   // ATENÇÃO: a contagem começa do ZERO! 0 = 1ª opção, 1 = 2ª...
                },
                {
                    pergunta: 'Por que o pessoal dança no pátio?',
                    opcoes: ['Para ganhar gorjeta', 'Para lembrar e para esquecer', 'Para espantar a Fera'],
                    correta: 1
                },
                {
                    pergunta: 'O que a Madame Tiffany espalhou pelo hotel?',
                    opcoes: ['As chaves do carro', 'Os brincos de diamante', 'Taças de champanhe rosa'],
                    correta: 2
                }
            ]
        },
        falaVitoria: ['Olha só... o espírito voltou! Um brinde. Sinta a coragem subindo.'],
        recompensa: { atributo: 'vidaMaxima', valor: 30, mensagem: '+30 VIDA MÁXIMA (O Espírito Voltou)' },
        falaDepois: ['Saúde! E se a Fera começar a cantar... proteja-se.']
    },

    // MISSÃO 5 - QUIZ sobre a Fera (o "ganho de conhecimento" final)
    porteiro: {
        nome: 'Porteiro da Noite',
        textura: 'npc_porteiro',
        falaComum: [
            'Relaxe. Aqui a gente é treinado para receber. Receber, receber, receber...',
            'Check-out? Pode fazer na hora que quiser. Sair é que são outros quinhentos.'
        ],
        falaDesafio: [
            'Então você quer enfrentar a Fera... Eu guardo o Sino da Missão, o único som que ela teme.',
            'Mas só entrego a quem conhece a Fera de verdade. Responda.'
        ],
        desafio: {
            tipo: 'quiz',
            titulo: 'Os Segredos da Fera',
            perguntas: [
                {
                    pergunta: 'O que NÃO consegue ferir a Fera de verdade?',
                    opcoes: ['Facas de aço', 'Sinos', 'Champanhe'],
                    correta: 0
                },
                {
                    pergunta: 'Qual som faz a Fera tremer?',
                    opcoes: ['Um solo de guitarra', 'O sino da missão', 'Aplausos'],
                    correta: 1
                },
                {
                    pergunta: 'Quando a Fera começa a cantar, o que você deve fazer?',
                    opcoes: ['Cantar junto', 'Defender-se', 'Tirar um cochilo'],
                    correta: 1
                }
            ]
        },
        falaVitoria: [
            'Muito bem. Leve o Sino da Missão.',
            'Toque-o na batalha: a Fera fica atordoada e as suas facas finalmente vão fazer efeito.'
        ],
        recompensa: { atributo: 'temSino', valor: true, mensagem: 'NOVO GOLPE: SINO DA MISSÃO' },
        falaDepois: ['Os aposentos do Mestre ficam no topo do corredor. Boa sorte. Você vai precisar.']
    },

    // FIGURANTES - não têm missão, mas dão PISTAS importantes
    veterano: {
        nome: 'Hóspede Veterano',
        textura: 'npc_veterano',
        falaComum: [
            'Fiz check-in em 1969. Era só para passar uma noite...',
            'Aqui todo mundo está preso a alguma coisa. Eu, por exemplo, estou preso ao buffet.',
            'Uma dica: quando a Fera começa a cantar, é porque lá vem pancada. Defenda-se!'
        ]
    },
    rapaz: {
        nome: 'Rapaz Bonito',
        textura: 'npc_rapaz',
        falaComum: [
            'Sou um dos "amigos" da Madame Tiffany. Acho. Ela tem tantos...',
            'Ouviu o sino quando chegou? O Porteiro da Noite guarda esse sino. Dizem que a Fera treme só de ouvir.'
        ]
    }
}
