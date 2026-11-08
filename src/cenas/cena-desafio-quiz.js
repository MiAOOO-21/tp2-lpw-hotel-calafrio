// Desafio do Quiz

class CenaDesafioQuiz extends CenaDesafioBase {

    constructor() {
        super('CenaDesafioQuiz')
    }

    create() {
        // Método herdado da CenaDesafioBase
        this.criarMoldura(this.config.titulo, 'SETAS escolhem, ENTER confirma')

        // A mesma cena é reutilizada pelo Capitão e pelo Porteiro, então eu zero tudo aqui no create(), que roda toda vez que ela abre
        this.indicePergunta = 0
        this.menu = null

        this.textoContador = this.add.text(LARGURA_TELA / 2, 140, '', {
            ...ESTILO_TEXTO,
            fontSize: '16px',
            color: CORES.textoDestaque
        }).setOrigin(0.5, 0)

        this.textoPergunta = this.add.text(LARGURA_TELA / 2, 175, '', {
            ...ESTILO_TEXTO,
            fontSize: '26px',
            align: 'center',
            wordWrap: { width: 680 }
        }).setOrigin(0.5, 0)

        this.textoResultado = this.add.text(LARGURA_TELA / 2, 420, '', {
            ...ESTILO_TEXTO,
            fontSize: '24px',
            fontStyle: 'bold'
        }).setOrigin(0.5)

        this.mostrarPergunta()
    }

    // Coloca a pergunta atual na tela com um menu de alternativas
    mostrarPergunta() {
        const perguntas = this.config.perguntas
        const pergunta = perguntas[this.indicePergunta]

        this.textoContador.setText(`Pergunta ${this.indicePergunta + 1} de ${perguntas.length}`)
        this.textoPergunta.setText(pergunta.pergunta)
        this.textoResultado.setText('')

        // Se já existe um menu da pergunta anterior, apaga antes de criar outro
        if (this.menu) this.menu.destruir()

        this.menu = new MenuOpcoes(this, 290, 260, pergunta.opcoes, (escolha) => this.responder(escolha))
    }

    // O jogador escolheu uma alternativa.
    async responder(escolha) {
        this.menu.desativar()
        const pergunta = this.config.perguntas[this.indicePergunta]

        if (escolha === pergunta.correta) {
            // Em caso de acerto
            this.textoResultado.setColor('#7dff9a').setText('Certo!')
            await esperar(this, 900)

            this.indicePergunta++
            if (this.indicePergunta >= this.config.perguntas.length) {
                this.textoResultado.setText('')
                this.vencer()          // acabaram as perguntas! (método herdado)
            } else {
                this.mostrarPergunta() // próxima pergunta
            }
        } else {
            // Em caso de erro
            this.cameras.main.shake(200, 0.008)
            this.textoResultado.setColor('#ff6b6b').setText('Hmm... não é bem isso. Tente de novo!')
            await esperar(this, 1000)
            this.textoResultado.setText('')
            this.menu.ativar()
        }
    }
}
