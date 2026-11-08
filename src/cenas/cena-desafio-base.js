// Base para os minijogos

class CenaDesafioBase extends Phaser.Scene {


  // Recebe os dados enviados pelo hotel no scene.launch(...)
  init(dados) {
    this.personagem = dados.personagem
    this.config = dados.personagem.desafio   // atalho para as configurações
    this.aoVencer = dados.aoVencer
    this.terminou = false
  }

  // Monta o visual dos minijogos
  criarMoldura(titulo, instrucoes) {
    // Retângulo preto meio transparente para escurecer o hotel lá atrás
    this.add.rectangle(0, 0, LARGURA_TELA, ALTURA_TELA, 0x000000, 0.7).setOrigin(0, 0)

    desenharPainel(this, 60, 30, LARGURA_TELA - 120, ALTURA_TELA - 60)

    // Retrato do hóspede
    this.add.image(120, 90, this.personagem.textura).setScale(3)

    this.add.text(LARGURA_TELA / 2, 55, titulo, {
      ...ESTILO_TEXTO,
      fontSize: '34px',
      fontStyle: 'bold',
      color: CORES.textoDestaque
    }).setOrigin(0.5, 0)

    this.add.text(LARGURA_TELA / 2, 100, this.personagem.nome, {
      ...ESTILO_TEXTO,
      fontSize: '18px',
      fontStyle: 'italic'
    }).setOrigin(0.5, 0)

    this.add.text(LARGURA_TELA / 2, ALTURA_TELA - 55, `${instrucoes}   |   ESC: desistir`, {
      ...ESTILO_TEXTO,
      fontSize: '16px'
    }).setOrigin(0.5).setAlpha(0.8)

    this.input.keyboard.on('keydown-ESC', () => this.finalizar(false))
  }

  // Mostra a comemoração. Depois de um tempinho, encerra com vitória
  vencer() {
    const texto = this.add.text(LARGURA_TELA / 2, ALTURA_TELA / 2, 'DESAFIO VENCIDO!', {
      ...ESTILO_TEXTO,
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#7dff9a',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5).setScale(0).setDepth(100)

    // "Back.easeOut" passa um pouquinho do tamanho e volta para dar o efeito de pulo
    this.tweens.add({ targets: texto, scale: 1, duration: 500, ease: 'Back.easeOut' })
    this.time.delayedCall(1500, () => this.finalizar(true))
  }

  // Fecha o minijogo e devolve o controle para o hotel. Se venceu = true então o jogador venceu
  finalizar(venceu) {
    if (this.terminou) return   // proteção contra chamar duas vezes
    this.terminou = true

    this.scene.resume('CenaHotel')   // descongela o hotel
    if (venceu) this.aoVencer()       // avisa o hotel (ele dá a recompensa)
    this.scene.stop()                 // desliga esta cena
  }
}
