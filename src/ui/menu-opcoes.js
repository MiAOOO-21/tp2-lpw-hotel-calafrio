// Menu de opções

class MenuOpcoes {

    constructor(cena, x, y, opcoes, aoEscolher, config = {}) {
        this.cena = cena
        this.aoEscolher = aoEscolher
        this.indice = 0         // qual opção está selecionada agora
        this.ativo = true       // o menu aceita comandos?

        // O operador "||" escolhe o primeiro valor que existir e se config.espacamento não foi informado, usa 40.
        const espacamento = config.espacamento || 40
        const tamanhoFonte = config.tamanhoFonte || '22px'

        // Cria um texto para cada opção. O map() transforma a lista de strings numa lista de objetos de texto do Phaser.
        this.itens = opcoes.map((textoOpcao, i) => {
            const item = cena.add.text(x + 30, y + i * espacamento, textoOpcao, {
                ...ESTILO_TEXTO,
                fontSize: tamanhoFonte
            })

            // Deixa o texto "clicável"
            item.setInteractive({ useHandCursor: true })
            item.on('pointerover', () => { if (this.ativo) this.selecionar(i) })
            item.on('pointerdown', () => {
                if (!this.ativo) return
                this.selecionar(i)
                this.confirmar()
            })
            return item
        })

        // A setinha que mostra a opção atual
        this.cursor = cena.add.text(x, y, '▶', {
            ...ESTILO_TEXTO,
            fontSize: tamanhoFonte,
            color: CORES.textoDestaque
        })

        // Teclado
        this.ouvintes = {
            'keydown-UP': (evento) => this.aoApertar(evento, -1),
            'keydown-W': (evento) => this.aoApertar(evento, -1),
            'keydown-DOWN': (evento) => this.aoApertar(evento, +1),
            'keydown-S': (evento) => this.aoApertar(evento, +1),
            'keydown-ENTER': (evento) => this.aoApertar(evento, 0),
            'keydown-SPACE': (evento) => this.aoApertar(evento, 0)
        }
        // Object.entries transforma o objeto numa lista de pares [nome, função]
        for (const [nomeEvento, funcao] of Object.entries(this.ouvintes)) {
            cena.input.keyboard.on(nomeEvento, funcao)
        }

        this.selecionar(0)
    }

    // direcao: -1 sobe, +1 desce, 0 confirma
    aoApertar(evento, direcao) {
        // evento.repeat é true quando a tecla está segurada (repetição automática do teclado). Ignoramos para não pular várias opções.
        if (!this.ativo || evento.repeat) return

        if (direcao === 0) {
            this.confirmar()
        } else {
            this.selecionar(this.indice + direcao)
        }
    }

    // Muda a opção selecionada (dando a volta se passar do fim)
    selecionar(novoIndice) {
        const total = this.itens.length
        // O "%" (resto da divisão) faz a volta: depois da última, vem a primeira.
        this.indice = (novoIndice + total) % total

        // Pinta a opção selecionada de dourado e as outras de branco
        this.itens.forEach((item, i) => {
            item.setColor(i === this.indice ? CORES.textoDestaque : CORES.texto)
        })
        // Move a setinha para a altura da opção escolhida
        this.cursor.y = this.itens[this.indice].y
    }

    // Avisa quem criou o menu qual opção foi escolhida
    confirmar() {
        if (!this.ativo) return
        this.aoEscolher(this.indice)
    }

    // Troca o texto de uma opção (ex.: "Champanhe (x3)" -> "(x2)")
    mudarTexto(indice, novoTexto) {
        this.itens[indice].setText(novoTexto)
    }

    // Liga/desliga o menu. Desligado, ele fica meio transparente.
    ativar() {
        this.ativo = true
        this.definirTransparencia(1)
    }
    desativar() {
        this.ativo = false
        this.definirTransparencia(0.4)
    }
    definirTransparencia(alfa) {
        this.itens.forEach((item) => item.setAlpha(alfa))
        this.cursor.setAlpha(alfa)
    }

    // Coloca todas as peças do menu numa profundidade de camada
    setDepth(profundidade) {
        this.itens.forEach((item) => item.setDepth(profundidade))
        this.cursor.setDepth(profundidade)
        return this
    }

    // Remove o menu da tela e desliga o teclado dele
    destruir() {
        for (const [nomeEvento, funcao] of Object.entries(this.ouvintes)) {
            this.cena.input.keyboard.off(nomeEvento, funcao)
        }
        this.itens.forEach((item) => item.destroy())
        this.cursor.destroy()
    }
}
