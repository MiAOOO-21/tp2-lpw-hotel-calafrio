// Mini jogo do teste de reflexo (referência a DBD??)

class CenaDesafioReflexo extends CenaDesafioBase {

  constructor() {
    super('CenaDesafioReflexo')
  }

  create() {
    this.criarMoldura(this.config.titulo, 'Aperte ESPAÇO com o marcador na faixa verde')

    // O Chef, grandão
    this.add.image(LARGURA_TELA / 2, 210, this.personagem.textura).setScale(4)

    // Dificuldade de cada rodada: posição 0 = 1º acerto, 1 = 2º, ...
    this.largurasFaixa = [140, 100, 70]     // pixels
    this.duracoesIda = [1300, 1000, 800]    // ms para cruzar a barra

    // A barra de fundo cinza
    this.barraX = 180          // onde a barra começa
    this.barraLargura = 600
    this.barraY = 340
    this.add.rectangle(this.barraX, this.barraY, this.barraLargura, 44, 0x222222)
      .setOrigin(0, 0.5)
      .setStrokeStyle(3, 0xffffff)

    // Na faixa verde, tamanho e posição mudam a cada rodada
    this.faixa = this.add.rectangle(0, this.barraY, 100, 40, 0x4ad66d).setOrigin(0, 0.5)

    // O marcador que é a faca passando
    this.marcador = this.add.rectangle(this.barraX, this.barraY, 8, 70, 0xffffff)

    this.textoAcertos = this.add.text(LARGURA_TELA / 2, 410, '', {
      ...ESTILO_TEXTO,
      fontSize: '26px',
      color: CORES.textoDestaque
    }).setOrigin(0.5)

    this.acertos = 0
    this.movimento = null   // a animação do marcador criado em prepararRodada
    this.input.keyboard.on('keydown-SPACE', (evento) => {
      if (!evento.repeat) this.tentar()
    })

    this.atualizarAcertos()
    this.prepararRodada()
  }

  // Sorteia a posição da faixa e põe o marcador para correr
  prepararRodada() {
    // Math.min garante que não passa do fim da lista de dificuldades
    const nivel = Math.min(this.acertos, this.largurasFaixa.length - 1)
    const larguraFaixa = this.largurasFaixa[nivel]

    this.faixa.setSize(larguraFaixa, 40)
    this.faixa.x = Phaser.Math.Between(this.barraX + 60, this.barraX + this.barraLargura - larguraFaixa - 10)

    // Reinicia o movimento do marcador
    if (this.movimento) this.movimento.stop()
    this.marcador.x = this.barraX
    this.movimento = this.tweens.add({
      targets: this.marcador,
      x: this.barraX + this.barraLargura,
      duration: this.duracoesIda[nivel],
      yoyo: true,       // vai e volta...
      repeat: -1,       // ...para sempre
      ease: 'Sine.easeInOut'
    })

    this.aceitando = true
  }

  // Se o jogador apertou espaço, então o marcador está dentro da faixa?
  tentar() {
    if (!this.aceitando) return

    // Colisão em 1 dimensão quando o x do marcador está entre o começo e o fim da faixa?
    const x = this.marcador.x
    const inicioFaixa = this.faixa.x
    const fimFaixa = this.faixa.x + this.faixa.width
    const dentro = x >= inicioFaixa && x <= fimFaixa

    if (dentro) {
      this.acertos++
      this.aceitando = false
      this.movimento.pause()   // congela o marcador para o jogador ver que acertou
      textoFlutuante(this, x, this.barraY - 50, 'SHHING!', '#ffffff')
      this.atualizarAcertos()

      if (this.acertos >= this.config.acertosNecessarios) {
        this.vencer()
      } else {
        this.time.delayedCall(600, () => this.prepararRodada())
      }
    } else {
      this.cameras.main.shake(150, 0.006)
      textoFlutuante(this, x, this.barraY - 50, 'Errou!', '#ff6b6b')
    }
  }

  // Mostra os acertos como facas: ◆ = afiada, ◇ = falta afiar
  atualizarAcertos() {
    const total = this.config.acertosNecessarios
    // repeat(n) repete um texto n vezes: '◆'.repeat(2) = '◆◆'
    const cheias = '◆ '.repeat(this.acertos)
    const vazias = '◇ '.repeat(total - this.acertos)
    this.textoAcertos.setText(`Facas afiadas: ${cheias}${vazias}`)
  }
}