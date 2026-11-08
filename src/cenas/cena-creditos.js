// Créditos finais

class CenaCreditos extends Phaser.Scene {

  constructor() {
    super('CenaCreditos')
  }

  // init() roda antes do create(), toda vez que a cena começa. Zero aqui a proteção contra sair duas vezes
  init() {
    this.saindo = false
  }

  create() {
    this.cameras.main.setBackgroundColor('#0a0508')

    // Cada linha da lista vira uma linha na tela. Linhas começando com "#" viram Títulos maiores
    const linhas = [
      '# HOTEL CALAFRIO',
      '',
      '# Programação',
      'Thales Nascimento Sardinha',
      '',
      '# Arte e roteiro',
      'Thales Nascimento Sardinha',
      '',
      '# Orientação',
      'Júlio Sardinha',
      '',
      '# Feito com',
      'Phaser 4 e Tiled',
      '',
      '# Inspirado (de longe!) em',
      'duas canções que todo mundo conhece',
      '',
      '',
      'Obrigado por jogar!'
    ]

    // Um container para mover todas as linhas juntas
    const bloco = this.add.container(LARGURA_TELA / 2, ALTURA_TELA)
    linhas.forEach((linha, i) => {
      const ehTitulo = linha.startsWith('#')
      const texto = this.add.text(0, i * 34, ehTitulo ? linha.substring(2) : linha, {
        ...ESTILO_TEXTO,
        fontSize: ehTitulo ? '28px' : '22px',
        fontStyle: ehTitulo ? 'bold' : 'normal',
        color: ehTitulo ? CORES.textoDestaque : CORES.texto
      }).setOrigin(0.5, 0)
      bloco.add(texto)
    })

    // Sobe até a última linha passar do topo da tela
    const alturaTotal = linhas.length * 34
    this.tweens.add({
      targets: bloco,
      y: -alturaTotal,
      duration: 18000,
      onComplete: () => this.voltarAoTitulo()
    })

    this.add.text(LARGURA_TELA - 12, ALTURA_TELA - 10, 'ENTER: voltar ao título', {
      ...ESTILO_TEXTO,
      fontSize: '14px'
    }).setOrigin(1, 1).setAlpha(0.6)

    this.input.keyboard.once('keydown-ENTER', () => this.voltarAoTitulo())
    this.cameras.main.fadeIn(800)
  }

  voltarAoTitulo() {
    if (this.saindo) return
    this.saindo = true
    this.cameras.main.fadeOut(600)
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('CenaTitulo'))
  }
}
