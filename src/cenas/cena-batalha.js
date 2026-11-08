// Loop da batalha com o boss
// Lembrete: o await impede a sobreposição das ações

class CenaBatalha extends Phaser.Scene {

  constructor() {
    super('CenaBatalha')
  }

  create() {
    // A ficha do jogador nesta luta é copiada do estadoJogo
    this.jogador = {
      vida: estadoJogo.vidaMaxima,
      vidaMaxima: estadoJogo.vidaMaxima,
      ataque: estadoJogo.ataque,
      defesa: estadoJogo.defesa,
      champanhes: estadoJogo.champanhes,
      defendendo: false
    }

    // Ficha da Fera
    this.fera = {
      vida: DADOS_FERA.vida,
      vidaMaxima: DADOS_FERA.vida,
      atordoada: 0,        // quantos turnos de atordoamento ainda restam
      carregando: false    // true depois da canção, daí o próximo golpe é o banquete
    };

    this.recargaSino = 0  // turnos até o sino poder ser usado de novo
    this.acabou = false

    this.criarCenario()
    this.criarInterface()
    this.atualizarBarras()

    this.cameras.main.fadeIn(600)

    this.novoTurno('A Fera dos Aposentos bloqueia o caminho!')
  }

  // MONTAGEM DA TELA

  criarCenario() {
    this.add.image(0, 0, 'batalha_fundo').setOrigin(0, 0)

    // A Fera à direita respirando
    this.spriteFera = this.add.image(680, 250, DADOS_FERA.textura)
    this.tweens.add({
      targets: this.spriteFera,
      scaleY: 1.04,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // O jogador à esquerda e de costas
    this.spriteJogador = this.add.image(230, 360, 'jogador', 9).setScale(4)
  }

  criarInterface() {
    // Nome e barra de vida da Fera no canto superior direito
    this.add.text(520, 30, DADOS_FERA.nome, { ...ESTILO_TEXTO, fontStyle: 'bold' })
    this.barraFera = this.add.graphics()
    this.textoVidaFera = this.add.text(520, 88, '', { ...ESTILO_TEXTO, fontSize: '16px' })
    this.textoStatusFera = this.add.text(700, 88, '', { ...ESTILO_TEXTO, fontSize: '16px', color: '#9ad7ff' })

    // Painel do jogador no canto inferior esquerdo
    desenharPainel(this, 20, 400, 360, 120)
    this.add.text(40, 412, 'Você', { ...ESTILO_TEXTO, fontStyle: 'bold', color: CORES.textoDestaque })
    this.barraJogador = this.add.graphics()
    this.textoVidaJogador = this.add.text(40, 478, '', { ...ESTILO_TEXTO, fontSize: '16px' })

    // Caixa de mensagens no topo à esquerda
    desenharPainel(this, 20, 20, 470, 90)
    this.textoMensagem = this.add.text(40, 34, '', {
      ...ESTILO_TEXTO,
      fontSize: '18px',
      wordWrap: { width: 430 }
    })

    // Menu de comandos no canto inferior direito
    desenharPainel(this, 600, 380, 340, 140)
    this.menu = new MenuOpcoes(this, 620, 394, this.textosDoMenu(), (escolha) => this.aoEscolher(escolha), {
      espacamento: 30,
      tamanhoFonte: '20px'
    })
    this.menu.desativar()   // só liga quando for a vez do jogador
  }

  // Os textos do menu mudam (quantidade de champanhes, recarga do sino...)
  textosDoMenu() {
    let textoSino
    if (!estadoJogo.temSino) textoSino = 'Sino da Missão (???)'
    else if (this.recargaSino > 0) textoSino = `Sino da Missão (espere ${this.recargaSino})`
    else textoSino = 'Sino da Missão'

    return [
      'Atacar',
      textoSino,
      `Champanhe Rosa (x${this.jogador.champanhes})`,
      'Defender'
    ]
  }

  // Redesenha as barras de vida e os textos de status
  atualizarBarras() {
    desenharBarra(this.barraFera, 520, 60, 400, 22, this.fera.vida, this.fera.vidaMaxima, CORES.vidaBoss)
    this.textoVidaFera.setText(`${this.fera.vida} / ${this.fera.vidaMaxima}`)

    let status = ''
    if (this.fera.atordoada > 0) status = `ATORDOADA (${this.fera.atordoada})`
    else if (this.fera.carregando) status = 'CANTANDO...'
    this.textoStatusFera.setText(status)

    desenharBarra(this.barraJogador, 40, 446, 320, 22, this.jogador.vida, this.jogador.vidaMaxima, CORES.vida)
    this.textoVidaJogador.setText(`Vida ${this.jogador.vida} / ${this.jogador.vidaMaxima}`)

    // Atualiza os textos de cada opção do menu
    this.textosDoMenu().forEach((texto, i) => this.menu.mudarTexto(i, texto))
  }

  // Mostra uma mensagem e espera um pouco para o jogador conseguir ler
  async mensagem(texto) {
    this.textoMensagem.setText(texto)
    await esperar(this, REGRAS_BATALHA.pausaMensagem)
  }

  // O LOOP DE TURNOS

  // Começa a vez do jogador. Mostra a mensagem e liga o menu
  novoTurno(texto = 'O que você vai fazer?') {
    this.jogador.defendendo = false
    this.textoMensagem.setText(texto)
    this.atualizarBarras()
    this.menu.ativar()
  }

  // Se o jogador escolheu uma opção do menu:
  async aoEscolher(escolha) {
    // Se algumas opções estiveram indisponíveis, então aviso e não gasto o turno
    if (escolha === 1 && !estadoJogo.temSino) {
      this.textoMensagem.setText('Você não tem nada parecido com um sino... ainda.')
      return
    }
    if (escolha === 1 && this.recargaSino > 0) {
      this.textoMensagem.setText('O sino ainda está vibrando. Espere mais um pouco.')
      return
    }
    if (escolha === 2 && this.jogador.champanhes <= 0) {
      this.textoMensagem.setText('Acabou o champanhe!')
      return
    }
    if (escolha === 2 && this.jogador.vida === this.jogador.vidaMaxima) {
      this.textoMensagem.setText('Sua vida já está cheia. Guarde o champanhe para depois!')
      return
    }

    this.menu.desativar()

    // AÇÃO DO JOGADOR
    if (escolha === 0) await this.jogadorAtaca()
    if (escolha === 1) await this.jogadorTocaSino()
    if (escolha === 2) await this.jogadorBebeChampanhe()
    if (escolha === 3) await this.jogadorDefende()

    // A Fera foi derrotada
    if (this.fera.vida <= 0) {
      await this.vitoria()
      return
    }

    // AÇÃO DA FERA (só vai acontecer depois das ações do jogador, por conta do await)
    await this.turnoDaFera()

    // O jogador foi derrotado
    if (this.jogador.vida <= 0) {
      await this.derrota()
      return
    }

    // No fim do turno, contadores diminuem
    if (this.recargaSino > 0) this.recargaSino--

    this.novoTurno()
  }

  // AÇÕES DO JOGADOR

  async jogadorAtaca() {
    // Fórmula de dano = ataque menos a defesa da Fera, com uma sorte de 85% a 115% (Phaser.Math.FloatBetween sorteia um decimal)
    const sorte = Phaser.Math.FloatBetween(0.85, 1.15)
    let dano = (this.jogador.ataque - DADOS_FERA.defesa) * sorte

    let texto
    if (this.fera.atordoada > 0) {
      dano *= DADOS_FERA.multiplicadorVulneravel
      texto = 'A Fera está atordoada! Sua faca entra fundo!'
    } else {
      dano *= DADOS_FERA.resistencia
      texto = 'Sua faca de aço mal arranha a Fera...'
    }

    // Math.round arredonda Math.max garante pelo menos 1 de dano
    dano = Math.max(1, Math.round(dano))

    // Animação do o jogador avançando e voltando
    this.tweens.add({ targets: this.spriteJogador, x: 300, duration: 120, yoyo: true })
    await esperar(this, 150)

    this.causarDanoNaFera(dano)
    await this.mensagem(`${texto} (${dano} de dano)`)
  }

  async jogadorTocaSino() {
    this.cameras.main.flash(400, 255, 255, 200)   // clarão
    this.cameras.main.shake(300, 0.005)

    this.fera.atordoada = REGRAS_BATALHA.turnosAtordoada
    this.fera.carregando = false   // o sino interrompe a canção!
    // +1 porque o contador vai diminuir já no fim DESTE turno
    this.recargaSino = REGRAS_BATALHA.recargaSino + 1

    // A Fera treme
    this.tweens.add({ targets: this.spriteFera, x: 690, duration: 50, yoyo: true, repeat: 5 })
    this.atualizarBarras()
    await this.mensagem('DLÉÉÉN! O sino ecoa pelo salão. A Fera cobre os ouvidos, atordoada!')
  }

  async jogadorBebeChampanhe() {
    this.jogador.champanhes--
    const vidaAntes = this.jogador.vida
    // Cura, mas sem passar da vida máxima
    this.jogador.vida = Math.min(this.jogador.vidaMaxima, this.jogador.vida + REGRAS_BATALHA.curaChampanhe)
    const curou = this.jogador.vida - vidaAntes

    textoFlutuante(this, this.spriteJogador.x, this.spriteJogador.y - 80, `+${curou}`, '#7dff9a')
    this.atualizarBarras()
    await this.mensagem(`Um gole de champanhe rosa, bem gelado. Você recupera ${curou} de vida.`)
  }

  async jogadorDefende() {
    this.jogador.defendendo = true
    this.spriteJogador.setTint(0x88bbff)   // fica azulado enquanto defende
    await this.mensagem('Você se prepara, com o gingado aprendido no pátio.')
  }

  // A VEZ DA FERA

  async turnoDaFera() {
    // Se atordoada, perde a vez.
    if (this.fera.atordoada > 0) {
      this.fera.atordoada--
      this.atualizarBarras()
      await this.mensagem('A Fera cambaleia, ainda tonta com o sino.')
      this.spriteJogador.clearTint()
      return
    }

    // Se estava cantando, agora vem o golpe forte!
    if (this.fera.carregando) {
      this.fera.carregando = false
      await this.feraAtaca(DADOS_FERA.multiplicadorBanquete, 'A Fera avança para o BANQUETE!')
      return
    }

    // Sorteio de canção ou garrada? Com pouca vida ela canta mais
    const furiosa = this.fera.vida < this.fera.vidaMaxima / 2
    const chance = furiosa ? DADOS_FERA.chanceCancaoFuriosa : DADOS_FERA.chanceCancao

    // Math.random() dá um número entre 0 e 1. Se for menor que a chance (ex.: 0.3), a canção acontece em 30% das vezes
    if (Math.random() < chance) {
      this.fera.carregando = true
      this.atualizarBarras()
      this.tweens.add({ targets: this.spriteFera, angle: 5, duration: 200, yoyo: true, repeat: 3 })
      await this.mensagem('A Fera começa uma canção hipnótica... algo GRANDE vem aí!')
      this.spriteJogador.clearTint()
      return
    }

    await this.feraAtaca(1, 'A Fera ataca com as garras!')
  }

  // Calcula e aplica o dano da Fera no jogador
  async feraAtaca(multiplicador, texto) {
    // A Fera dá um bote para a esquerda
    this.tweens.add({ targets: this.spriteFera, x: 600, duration: 120, yoyo: true })
    await esperar(this, 150)

    const sorte = Phaser.Math.FloatBetween(0.85, 1.15)
    let dano = (DADOS_FERA.ataque - this.jogador.defesa) * multiplicador * sorte

    if (this.jogador.defendendo) {
      dano *= REGRAS_BATALHA.reducaoDefender
      texto += ' Você se defende!'
    }
    dano = Math.max(1, Math.round(dano))

    this.jogador.vida = Math.max(0, this.jogador.vida - dano)

    this.cameras.main.shake(250, 0.015)
    this.piscar(this.spriteJogador)
    textoFlutuante(this, this.spriteJogador.x, this.spriteJogador.y - 80, `-${dano}`, '#ff6b6b')
    this.atualizarBarras()
    this.spriteJogador.clearTint()

    await this.mensagem(`${texto} (${dano} de dano)`)
  }

  // Aplica dano na Fera com efeitos visuais
  causarDanoNaFera(dano) {
    this.fera.vida = Math.max(0, this.fera.vida - dano)
    this.piscar(this.spriteFera)
    textoFlutuante(this, this.spriteFera.x, this.spriteFera.y - 120, `-${dano}`, '#ffcf5a')
    this.atualizarBarras()
  }

  // Faz um sprite piscar em vermelho rapidamente
  piscar(sprite) {
    sprite.setTint(0xff4444)
    this.time.delayedCall(150, () => sprite.clearTint())
  }

  // FIM DA LUTA

  async vitoria() {
    this.acabou = true
    this.tweens.killTweensOf(this.spriteFera)
    // A Fera some devagar afundando
    this.tweens.add({ targets: this.spriteFera, alpha: 0, y: 320, angle: -10, duration: 1500 })
    await this.mensagem('A Fera solta um último uivo desafinado e desaba!')
    await this.mensagem('Lá longe, no saguão, uma porta range...')

    this.cameras.main.fadeOut(1000, 255, 255, 255)   // fade para BRANCO
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CenaCutscene', { id: 'final' })
    })
  }

  async derrota() {
    this.acabou = true
    this.tweens.add({ targets: this.spriteJogador, alpha: 0.3, angle: 90, duration: 800 })
    await this.mensagem('Tudo gira... Os espelhos do teto sorriem para você.')
    this.textoMensagem.setText('O hotel sempre tem lugar para mais um. Tentar de novo?')

    // Troca o menu de comandos por um menu de tentar de novo
    this.menu.destruir()
    this.menu = new MenuOpcoes(this, 620, 410, ['Tentar de novo', 'Voltar ao título'], (escolha) => {
      if (escolha === 0) this.scene.restart()       // recomeça a batalha (vida cheia)
      else this.scene.start('CenaTitulo')
    })
  }
}