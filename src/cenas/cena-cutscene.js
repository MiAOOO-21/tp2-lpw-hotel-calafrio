/* Tocador de Cutscenes
 * Para chamar tem que dizer qual id da cutscene quer, exemplo:
 *     this.scene.start('CenaCutscene', { id: 'abertura' })
 *     this.scene.start('CenaCutscene', { id: 'final' })
 * e ela busca o roteiro em 'dados/cutscenes.js'.
 * Essa é a sequência:
 *   1. a tela escurece
 *   2. troca a imagem e clareia
 *   3. a imagem dá um zoom bem lento
 *   4. a legenda é digitada na caixa de diálogo
 */

class CenaCutscene extends Phaser.Scene {

    constructor() {
        super('CenaCutscene')
    }

    // Recebe os dados da cutscene
    init(dados) {
        this.cutscene = CUTSCENES[dados.id]
        this.indiceQuadro = -1
        this.trocandoQuadro = false
        this.terminando = false

        // Proteção para caso digitar um id errado
        if (!this.cutscene) {
            console.error(`Cutscene "${dados.id}" não existe em dados/cutscenes.js!`)
        }
    }

    create() {
        // Fundo preto por baixo de tudo
        this.cameras.main.setBackgroundColor('#000000')

        // A imagem do quadro vai sendo trocada com setTexture, em vez de criar uma nova a cada vez.
        const primeiro = this.cutscene.quadros[0].imagem
        this.imagem = this.add.image(LARGURA_TELA / 2, ALTURA_TELA / 2, primeiro)

        // Título grande
        this.titulo = this.add.text(LARGURA_TELA / 2, ALTURA_TELA / 2 - 60, '', {
            ...ESTILO_TEXTO,
            fontSize: '72px',
            fontStyle: 'bold',
            color: '#ffcf5a',
            stroke: '#2a0a00',
            strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5)

        // Reaproveita a mesma caixa de diálogo do hotel para as legendas
        this.dialogo = new CaixaDialogo(this)

        // ESC para pular
        this.add.text(LARGURA_TELA - 12, 10, 'ESC: pular', {
            ...ESTILO_TEXTO,
            fontSize: '14px'
        }).setOrigin(1, 0).setAlpha(0.6)

        // Controles das cutscene
        this.input.keyboard.on('keydown-SPACE', (evento) => this.avancar(evento))
        this.input.keyboard.on('keydown-ENTER', (evento) => this.avancar(evento))
        this.input.on('pointerdown', () => this.avancar({ repeat: false }))
        this.input.keyboard.on('keydown-ESC', () => this.terminar())

        this.proximoQuadro()
    }

    avancar(evento) {
        // Ignora tecla segurada e cliques durante a troca de quadro
        if (evento.repeat || this.trocandoQuadro) return
        // A caixa decide: completa o texto OU fecha (e o fechar chama proximoQuadro)
        this.dialogo.avancar()
    }

    // Vai para o próximo quadro ou termina a cutscene
    proximoQuadro() {
        this.indiceQuadro++

        // Caso acabem os quadros, termina a cutscene
        if (this.indiceQuadro >= this.cutscene.quadros.length) {
            this.terminar()
            return
        }

        const quadro = this.cutscene.quadros[this.indiceQuadro]

        // O primeiro quadro só clareia a tela
        if (this.indiceQuadro === 0) {
            this.mostrarQuadro(quadro)
            this.cameras.main.fadeIn(800)
            return
        }

        // Nos outros quadros escurece, troca, clareia
        this.trocandoQuadro = true
        this.cameras.main.fadeOut(350, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.mostrarQuadro(quadro)
            this.cameras.main.fadeIn(350)
        })
    }

    // Coloca na tela a imagem, o título e a legenda de um quadro
    mostrarQuadro(quadro) {
        this.trocandoQuadro = false

        // Troca a imagem
        this.imagem.setTexture(quadro.imagem)

        // Escala para cobrir a tela toda
        const escala = Math.max(LARGURA_TELA / this.imagem.width, ALTURA_TELA / this.imagem.height)
        this.imagem.setScale(escala)

        // Efeito de zoom (meu pai chama de Ken Burns)
        this.tweens.killTweensOf(this.imagem)   // cancela o zoom do quadro anterior
        this.tweens.add({
            targets: this.imagem,
            scale: escala * 1.08,
            duration: 8000,
            ease: 'Sine.easeInOut'
        })

        // Título grande (se o quadro tiver um). O "||" usa '' se não tiver
        this.titulo.setText(quadro.titulo || '')
        if (quadro.titulo) {
            this.titulo.setAlpha(0).setScale(0.8)
            this.tweens.add({ targets: this.titulo, alpha: 1, scale: 1, duration: 900, ease: 'Back.easeOut' })
        }

        // Legenda. Quando o jogador fechar a caixa, vai para o próximo quadro
        this.dialogo.mostrar('', [quadro.texto || ''], () => this.proximoQuadro())
    }

    // Escurece e vai para a próxima cena
    terminar() {
        if (this.terminando) return   // evita terminar duas vezes (ESC + fim)
        this.terminando = true

        this.cameras.main.fadeOut(700, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(this.cutscene.proximaCena)
        })
    }
}
