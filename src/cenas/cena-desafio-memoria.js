// Desafio da memória

class CenaDesafioMemoria extends CenaDesafioBase {

    constructor() {
        super('CenaDesafioMemoria')
    }

    create() {
        this.criarMoldura(this.config.titulo, 'Observe os passos e repita com as SETAS')

        // A dançarina no meio da tela, bem grande
        this.dancarina = this.add.image(LARGURA_TELA / 2, 215, this.personagem.textura).setScale(4)

        // As 4 setas. Cada uma sabe: a tecla, o símbolo, a cor e como a dançarina se mexe (dx, dy) quando ela acende
        this.setas = [
            { tecla: 'LEFT', simbolo: '◀', cor: 0xff5a8c, dx: -30, dy: 0 },
            { tecla: 'UP', simbolo: '▲', cor: 0x4ad6ff, dx: 0, dy: -30 },
            { tecla: 'DOWN', simbolo: '▼', cor: 0x4ad66d, dx: 0, dy: 20 },
            { tecla: 'RIGHT', simbolo: '▶', cor: 0xffcf5a, dx: 30, dy: 0 }
        ];

        // Desenha os 4 quadrados, lado a lado
        this.setas.forEach((seta, i) => {
            const x = LARGURA_TELA / 2 + (i - 1.5) * 110;   // (i - 1.5) centraliza os 4
            const y = 370
            seta.quadrado = this.add.rectangle(x, y, 90, 90, 0x2a1a2a).setStrokeStyle(4, seta.cor)
            this.add.text(x, y, seta.simbolo, { ...ESTILO_TEXTO, fontSize: '40px' }).setOrigin(0.5)

            // Cada seta do teclado chama aoApertar com o NÚMERO da seta (0 a 3)
            this.input.keyboard.on(`keydown-${seta.tecla}`, (evento) => {
                if (!evento.repeat) this.aoApertar(i)
            })
        })

        this.textoStatus = this.add.text(LARGURA_TELA / 2, 445, '', {
            ...ESTILO_TEXTO,
            fontSize: '22px',
            color: CORES.textoDestaque
        }).setOrigin(0.5)

        this.rodada = 0                 // índice da rodada atual
        this.aceitandoEntrada = false   // o jogador é impedido de apertar as setas
        this.comecarRodada(true)
    }


    // Começa uma rodada. True = sorteia passos novos. False = repete os mesmos depois de um erro
    async comecarRodada(novaSequencia) {
        this.aceitandoEntrada = false
        const tamanho = this.config.rodadas[this.rodada]

        if (novaSequencia) {
            this.sequencia = []
            for (let i = 0; i < tamanho; i++) {
                // Sorteia um número de 0 a 3 (uma das quatro setas)
                this.sequencia.push(Phaser.Math.Between(0, 3))
            }
        }
        this.posicaoJogador = 0   // quantos passos o jogador já acertou

        this.textoStatus.setText(`Rodada ${this.rodada + 1} de ${this.config.rodadas.length}: observe...`)
        await esperar(this, 900)

        // Mostra os passos, um de cada vez. O await espera cada um terminar
        for (const indiceSeta of this.sequencia) {
            await this.acenderSeta(indiceSeta, 450)
            await esperar(this, 180)
        }

        this.textoStatus.setText('Sua vez! Repita os passos.')
        this.aceitandoEntrada = true
    }

    // Acende uma seta e faz a dançarina dar o passo. Devolve uma Promise.
    acenderSeta(indice, duracao) {
        const seta = this.setas[indice]
        seta.quadrado.setFillStyle(seta.cor)

        // Cancela um passo que ainda estava acontecendo e volta ao centro. Sem isso, apertar rápido faria a dançarina escorregar pela tela
        this.tweens.killTweensOf(this.dancarina)
        this.dancarina.setPosition(LARGURA_TELA / 2, 215)

        // Animação que vai e volta quando a dançarina dá o passo
        this.tweens.add({
            targets: this.dancarina,
            x: LARGURA_TELA / 2 + seta.dx,
            y: 215 + seta.dy,
            duration: duracao / 2,
            yoyo: true,
            ease: 'Quad.easeOut'
        })

        // Depois da duração, apaga a seta
        return esperar(this, duracao).then(() => {
            seta.quadrado.setFillStyle(0x2a1a2a)
        })
    }

    // O jogador apertou uma seta
    aoApertar(indice) {
        if (!this.aceitandoEntrada) return

        this.acenderSeta(indice, 200)

        // Compara com o passo esperado
        if (indice === this.sequencia[this.posicaoJogador]) {
            this.posicaoJogador++

            // Se completou a sequência inteira
            if (this.posicaoJogador === this.sequencia.length) {
                this.aceitandoEntrada = false
                this.rodada++

                if (this.rodada >= this.config.rodadas.length) {
                    this.textoStatus.setText('')
                    this.vencer()   // todas as rodadas feitas!
                } else {
                    this.textoStatus.setText('Isso aí! Mais difícil agora...')
                    this.time.delayedCall(1000, () => this.comecarRodada(true))
                }
            }
        } else {
            // Senão, errou o passo. Daí mostra de novo a mesma sequência
            this.aceitandoEntrada = false
            this.cameras.main.shake(250, 0.01)
            this.textoStatus.setText('Ai, pisou no pé dela! Vamos de novo...')
            this.time.delayedCall(1200, () => this.comecarRodada(false))
        }
    }
}
