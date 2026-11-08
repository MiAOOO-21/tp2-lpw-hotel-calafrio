// Tela de título

class CenaTitulo extends Phaser.Scene {

    constructor() {
        super('CenaTitulo')
    }

    create() {
        // Zera a cena para reutilizá-la quando você terminar o jogo
        this.comecou = false

        // Muda a âncora de posicionamento da imagem (o padrão do Phaser é pelo centro)
        this.add.image(0, 0, 'titulo_fundo').setOrigin(0, 0)

        console.log(this.add.image(0, 0, 'titulo_fundo').setOrigin(0, 0))

        // Título do jogo (tirei porque coloquei na imagem mesmo)
        /**
        this.add.text(LARGURA_TELA / 2, 120, 'HOTEL CALAFRIO', {
          ...ESTILO_TEXTO,
          fontSize: '64px',
          fontStyle: 'bold',
          color: '#ff5a8c',
          stroke: '#1a0010',
          strokeThickness: 8
        }).setOrigin(0.5)   // 0.5 = centralizado
        // */

        // Subtítulo
        this.add.text(LARGURA_TELA / 3, 20, 'um RPG de terror com trilha sonora imaginária', {
            ...ESTILO_TEXTO,
            fontSize: '18px',
            fontStyle: 'italic'
        }).setOrigin(0.5)

        // Texto piscando
        const aperte = this.add.text(LARGURA_TELA / 2, ALTURA_TELA - 70, 'Aperte ENTER para fazer check-in', {
            ...ESTILO_TEXTO,
            fontSize: '24px',
            color: CORES.textoDestaque,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5)

        this.tweens.add({ targets: aperte, alpha: 0.15, duration: 700, yoyo: true, repeat: -1 })

        // Usei o "once" para evitar começar o jogo duas vezes
        this.input.keyboard.once('keydown-ENTER', () => this.comecarJogo())
        this.input.once('pointerdown', () => this.comecarJogo())
    }

    comecarJogo() {
        if (this.comecou) return   // proteção contra clique + ENTER juntos
        this.comecou = true

        reiniciarEstado()   // save novo (estado.js)

        // Fade da tela para trocar de cena
        this.cameras.main.fadeOut(600, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Passa um objeto de dados para a próxima cena: ela vai recebê-lo no método init(dados).
            this.scene.start('CenaCutscene', { id: 'abertura' })
        })
    }
}
