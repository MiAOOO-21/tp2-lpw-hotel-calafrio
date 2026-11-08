// Loop de exploração do Hotel
// Tá tudo aqui, não consegui dividir ainda

class CenaHotel extends Phaser.Scene {

  constructor() {
    super('CenaHotel')
  }

  // Monta a cena, roda uma vez
  create() {
    this.entrandoNosAposentos = false   // evita entrar na porta duas vezes
    this.avisouPortaTrancada = false    // evita repetir o aviso da porta
    this.direcao = 'baixo'              // para onde o jogador está virado

    this.criarMapa()
    this.criarObjetosDoMapa()
    this.criarColisoes()
    this.configurarCamera()
    this.configurarControles()
    this.criarInterface()
    this.atualizarInterface()

    this.cameras.main.fadeIn(600)

    // Ensina os controles
    if (estadoJogo.missaoAtual === 0 && estadoJogo.etapa === 'falarComGerente') {
      this.dialogo.mostrar('Dica', [
        'Use as SETAS (ou W A S D) para andar e ESPAÇO para conversar.',
        'A seta amarela mostra aonde ir. Converse com todo mundo: os hóspedes dão pistas importantes!',
        'Cuidado, pois nunca se sabe quais criaturas se escondem pelos corredores...'
      ])
    }
  }

  //Carrega o mapa do Tiled e cria as camadas
  criarMapa() {
    // Cria o mapa a partir do JSON carregado com a chave 'mapa_hotel'
    this.mapa = this.make.tilemap({ key: 'mapa_hotel' })

    // Liga o tileset do Tiled na imagem carregada
    const tileset = this.mapa.addTilesetImage('tileset', 'tileset')

    // Cria as camadas visuais de baixo primeiro
    this.camadaChao = this.mapa.createLayer('Chao', tileset)
    this.camadaParedes = this.mapa.createLayer('Paredes', tileset)

    // Todos os tiles que têm a propriedade "colide = true" no Tiled passam a ser sólidos
    this.camadaParedes.setCollisionByProperty({ colide: true })

    // O mundo da física tem o tamanho do mapa
    this.physics.world.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels)
  }

  // Lê a camada de objetos do Tiled e cria cada coisa no lugar certo. Cada objeto é identificado pelo seu nome
  criarObjetosDoMapa() {
    // Grupos juntam vários objetos parecidos. static = não se movem.
    this.npcs = this.physics.add.staticGroup()
    this.tacas = this.physics.add.group()
    this.npcsPorId = {}   // para achar um NPC pelo id: this.npcsPorId['dama']

    let posicaoInicial = { x: 100, y: 100 }   // valor de segurança

    const objetos = this.mapa.getObjectLayer('Objetos').objects

    objetos.forEach((obj) => {
      if (obj.name === 'inicio') {
        posicaoInicial = { x: obj.x, y: obj.y }
      } else if (obj.name === 'taca') {
        this.criarTaca(obj)
      } else if (obj.name === 'porta_mestre') {
        this.criarPorta(obj)
      } else if (PERSONAGENS[obj.name]) {
        this.criarNpc(obj)
      } else {
        console.warn(`Objeto "${obj.name}" do Tiled não é conhecido pelo jogo.`)
      }
    })

    this.criarJogador(posicaoInicial.x, posicaoInicial.y)
  }

  // Cria um NPC parado no mapa
  criarNpc(obj) {
    const dados = PERSONAGENS[obj.name]
    const npc = this.npcs.create(obj.x, obj.y, dados.textura)
    npc.idPersonagem = obj.name   // "etiqueta" para saber quem é quem
    npc.setDepth(npc.y)           // profundidade = altura (explicação em update)
    this.npcsPorId[obj.name] = npc
  }

  // Cria uma taça de champanhe que fica escondida até a missão começar
  criarTaca(obj) {
    const taca = this.tacas.create(obj.x, obj.y, 'taca')
    taca.setDepth(taca.y)
    // Balança para cima e para baixo, para chamar atenção
    this.tweens.add({ targets: taca, y: obj.y - 4, duration: 600, yoyo: true, repeat: -1 })

    // disableBody(true, true) = desliga a física e esconde
    if (!estadoJogo.buscaAtiva) {
      taca.disableBody(true, true)
    }
  }

  // Cria a porta dos aposentos do Mestre
  criarPorta(obj) {
    // Objetos retangulares do Tiled usam x/y do canto superior esquerdo, mas o Phaser posiciona pelo centro. Por isso tem que somar metade do tamanho
    const x = obj.x + obj.width / 2
    const y = obj.y + obj.height / 2
    this.porta = this.physics.add.staticSprite(x, y, 'porta_mestre', 0)

    if (estadoJogo.etapa === 'enfrentarMestre') {
      this.porta.setFrame(1)   // quadro 1 = aberta
    }
  }

  // Cria o jogador com física
  criarJogador(x, y) {
    this.jogador = this.physics.add.sprite(x, y, 'jogador', 0)
    this.jogador.body.setSize(16, 12)
    this.jogador.body.setOffset(8, 19)

    this.jogador.setCollideWorldBounds(true)
  }

  // Diz quem esbarra em quem
  criarColisoes() {
    // collider = os dois se não atravessam
    this.physics.add.collider(this.jogador, this.camadaParedes)
    this.physics.add.collider(this.jogador, this.npcs)

    // Com a porta, além de bloquear, chama uma função ao encostar
    this.physics.add.collider(this.jogador, this.porta, () => this.tocarNaPorta())

    // overlap = os dois se atravessam, mas avisam quando se tocam
    this.physics.add.overlap(this.jogador, this.tacas, (jogador, taca) => this.coletarTaca(taca))
  }

  configurarCamera() {
    const camera = this.cameras.main
    // A câmera não mostra nada além das bordas do mapa
    camera.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels)
    // Ela segue o jogador suavemente
    camera.startFollow(this.jogador, true, 0.1, 0.1)
  }

  configurarControles() {
    // para andar com o personagem
    this.setas = this.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT')
    this.wasd = this.input.keyboard.addKeys('W,A,S,D')

    // para conversar
    this.input.keyboard.on('keydown-SPACE', (evento) => this.aoApertarAcao(evento))
    this.input.keyboard.on('keydown-ENTER', (evento) => this.aoApertarAcao(evento))
  }

// Ações
  aoApertarAcao(evento) {
    // evento.repeat = tecla SEGURADA (repetição automática). Ignoramos.
    if (evento.repeat || this.entrandoNosAposentos) return

    if (this.dialogo.aberta) {
      this.dialogo.avancar()
      return
    }

    const npcProximo = this.encontrarNpcProximo()
    if (npcProximo) {
      this.interagir(npcProximo)
    }
  }

  // Cria o HUD e a caixa de diálogo
  criarInterface() {
    // Painel do objetivo no alto da tela
    desenharPainel(this, 10, 10, 600, 44).setScrollFactor(0).setDepth(900)
    this.textoObjetivo = this.add.text(24, 21, '', {
      ...ESTILO_TEXTO,
      fontSize: '17px'
    }).setScrollFactor(0).setDepth(901)

    // Painel dos atributos no canto direito
    desenharPainel(this, LARGURA_TELA - 340, 10, 330, 44).setScrollFactor(0).setDepth(900)
    this.textoAtributos = this.add.text(LARGURA_TELA - 326, 21, '', {
      ...ESTILO_TEXTO,
      fontSize: '17px',
      color: CORES.textoDestaque
    }).setScrollFactor(0).setDepth(901)

    // 
    this.dicaConversa = this.add.text(0, 0, '[ESPAÇO] Falar', {
      ...ESTILO_TEXTO,
      fontSize: '14px',
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5, 1).setDepth(950).setVisible(false)

    // Seta amarela que aponta para o objetivo atual
    this.marcador = this.add.text(0, 0, '▼', {
      ...ESTILO_TEXTO,
      fontSize: '26px',
      color: '#ffe14a',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 1).setDepth(951)

    this.dialogo = new CaixaDialogo(this)
  }

  // O loop do update 60 fps
  update(tempo) {
    // Se entrar na porta não faz mais nada
    if (this.entrandoNosAposentos) return

    // Com a caixa de diálogo aberta, o jogador não anda
    if (this.dialogo.aberta) {
      this.pararJogador()
      this.dicaConversa.setVisible(false)
      this.marcador.setVisible(false)
      return   // "return" encerra o update aqui mesmo
    }

    this.moverJogador()

    // Profundidade = posição Y. Quem está mais "embaixo" na tela é desenhado por cima. Assim o jogador passa na frente ou atrás dos NPCs de forma natural
    this.jogador.setDepth(this.jogador.y)

    // Se tem alguém perto para conversar, mostra a dica em cima dele
    const npcProximo = this.encontrarNpcProximo()
    if (npcProximo) {
      this.dicaConversa.setPosition(npcProximo.x, npcProximo.y - 20)
      this.dicaConversa.setVisible(true)
    } else {
      this.dicaConversa.setVisible(false)
    }

    this.atualizarMarcador(tempo)
  }

  // Lê o teclado e move o jogador nas 8 direções
  moverJogador() {
    // Cada eixo vale -1, 0 ou +1
    let dx = 0
    let dy = 0
    if (this.setas.LEFT.isDown || this.wasd.A.isDown) dx = -1
    else if (this.setas.RIGHT.isDown || this.wasd.D.isDown) dx = 1
    if (this.setas.UP.isDown || this.wasd.W.isDown) dy = -1
    else if (this.setas.DOWN.isDown || this.wasd.S.isDown) dy = 1

    let velocidade = VELOCIDADE_JOGADOR
    if (dx !== 0 && dy !== 0) velocidade *= Math.SQRT1_2

    this.jogador.setVelocity(dx * velocidade, dy * velocidade)

    // Escolhe a animação
    if (dx < 0) this.direcao = 'esquerda'
    else if (dx > 0) this.direcao = 'direita'
    else if (dy < 0) this.direcao = 'cima'
    else if (dy > 0) this.direcao = 'baixo'

    if (dx !== 0 || dy !== 0) {
      // O "true" = não reinicia a animação se ela já estiver tocando
      this.jogador.anims.play(`andar_${this.direcao}`, true)
    } else {
      this.pararJogador()
    }
  }

  // Para o jogador e deixa ele no quadro parado da direção atual
  pararJogador() {
    this.jogador.setVelocity(0, 0)
    this.jogador.anims.stop()
    const quadroParado = { baixo: 0, esquerda: 3, direita: 6, cima: 9 }
    this.jogador.setFrame(quadroParado[this.direcao])
  }

  // Procura o NPC mais perto do jogador dentro da distância de conversa
  encontrarNpcProximo() {
    let maisProximo = null
    let menorDistancia = DISTANCIA_CONVERSA

    this.npcs.getChildren().forEach((npc) => {
      const distancia = Phaser.Math.Distance.Between(this.jogador.x, this.jogador.y, npc.x, npc.y)
      if (distancia < menorDistancia) {
        menorDistancia = distancia
        maisProximo = npc
      }
    })
    return maisProximo
  }

  // Faz a seta amarela flutuar em cima do objetivo
  atualizarMarcador(tempo) {
    const alvo = this.alvoDoObjetivo()
    if (!alvo) {
      this.marcador.setVisible(false)
      return
    }
    const balanco = Math.sin(tempo / 200) * 4

    if (alvo === this.porta) {
      // A porta fica colada no topo do mapa, então a seta vai embaixo dela
      this.marcador.setText('▲').setOrigin(0.5, 0)
      this.marcador.setPosition(alvo.x, alvo.y + 20 + balanco)
    } else {
      // A seta vai em cima das pessoas
      this.marcador.setText('▼').setOrigin(0.5, 1)
      this.marcador.setPosition(alvo.x, alvo.y - 40 + balanco)
    }
    this.marcador.setVisible(true)
  }

  // Indica para onde o jogador deve ir agora
  alvoDoObjetivo() {
    const etapa = estadoJogo.etapa
    if (etapa === 'falarComGerente' || etapa === 'voltarAoGerente') {
      return this.npcsPorId.dama
    }
    if (etapa === 'fazerDesafio') {
      // Durante a busca, não aponta
      if (estadoJogo.buscaAtiva && estadoJogo.tacasColetadas < 3) return null
      return this.npcsPorId[MISSOES[estadoJogo.missaoAtual].hospede]
    }
    if (etapa === 'enfrentarMestre') return this.porta
    return null
  }

  // CONVERSAS E O LOOP DE MISSÕES

  // Para quando o jogador aperta a barra de espaço perto de alguém:
  interagir(npc) {
    const id = npc.idPersonagem
    const dados = PERSONAGENS[id]

    // A Dama tem regras próprias
    if (id === 'dama') {
      this.falarComDama()
      return
    }

    // Verifica qual a missão atual
    const missao = MISSOES[estadoJogo.missaoAtual]
    const ehAVezDele = missao && missao.hospede === id && estadoJogo.etapa === 'fazerDesafio'

    if (ehAVezDele) {
      this.falarSobreDesafio(dados)
    } else if (this.missaoJaConcluida(id)) {
      this.dialogo.mostrar(dados.nome, dados.falaDepois || dados.falaComum)
    } else {
      this.dialogo.mostrar(dados.nome, dados.falaComum)
    }
  }

  // Verifica se a missão foi concluída
  missaoJaConcluida(id) {
    // findIndex devolve a posição do hóspede na lista (ou -1 se não achar)
    const indice = MISSOES.findIndex((missao) => missao.hospede === id)
    if (indice === -1) return false   // é figurante, não tem missão

    return indice < estadoJogo.missaoAtual ||
      (indice === estadoJogo.missaoAtual && estadoJogo.etapa === 'voltarAoGerente')
  }

  // A Dama da Vela é o gerente do loop que entrega as missões e recebe o jogador de volta
  falarComDama() {
    const nome = PERSONAGENS.dama.nome
    const etapa = estadoJogo.etapa
    const missao = MISSOES[estadoJogo.missaoAtual]

    if (etapa === 'falarComGerente') {
      // Primeira conversa: boas-vindas + primeiro pedido.
      // Os "..." juntam duas listas numa só.
      const falas = [...FALAS_DAMA.boasVindas, ...missao.pedido]
      this.dialogo.mostrar(nome, falas, () => {
        estadoJogo.etapa = 'fazerDesafio'
        this.atualizarInterface()
      })

    } else if (etapa === 'fazerDesafio') {
      this.dialogo.mostrar(nome, [...FALAS_DAMA.aindaNao, `Lembre-se: ${missao.objetivo}.`])

    } else if (etapa === 'voltarAoGerente') {
      const proximaMissao = MISSOES[estadoJogo.missaoAtual + 1]

      if (proximaMissao) {
        // Se concluiu mas ainda tem missão, agradece e já dá a próxima
        this.dialogo.mostrar(nome, [...FALAS_DAMA.agradecimento, ...proximaMissao.pedido], () => {
          estadoJogo.missaoAtual++
          estadoJogo.etapa = 'fazerDesafio'
          this.atualizarInterface()
        })
      } else {
        // Senão, acabaram as missões e é o fim do primeiro loop!
        this.dialogo.mostrar(nome, [...FALAS_DAMA.agradecimento, ...FALAS_DAMA.final], () => {
          estadoJogo.missaoAtual++
          estadoJogo.etapa = 'enfrentarMestre'
          this.abrirPorta()
          this.atualizarInterface()
        })
      }

    } else if (etapa === 'enfrentarMestre') {
      this.dialogo.mostrar(nome, FALAS_DAMA.lembrete)
    }
  }

  // Conversa com o hóspede da missão atual e começa o desafio dele
  falarSobreDesafio(dados) {
    const desafio = dados.desafio

    // O desafio de busca é especial e acontece no próprio mapa
    if (desafio.tipo === 'busca') {
      if (!estadoJogo.buscaAtiva) {
        this.dialogo.mostrar(dados.nome, dados.falaDesafio, () => this.comecarBusca())
      } else if (estadoJogo.tacasColetadas < desafio.quantidade) {
        const faltam = desafio.quantidade - estadoJogo.tacasColetadas
        this.dialogo.mostrar(dados.nome, [`Ainda faltam ${faltam} taça(s), querido. Procure pelo hotel todo!`])
      } else {
        this.vencerDesafio(dados)
      }
      return
    }

    // Os outros desafios são minijogos em outra cena
    this.dialogo.mostrar(dados.nome, dados.falaDesafio, () => this.abrirMinijogo(dados))
  }

  // Faz as taças aparecerem no mapa
  comecarBusca() {
    estadoJogo.buscaAtiva = true
    this.tacas.getChildren().forEach((taca) => {
      // enableBody(reiniciar, x, y, ativar, mostrar)
      taca.enableBody(false, 0, 0, true, true)
    })
    this.atualizarInterface()
  }

  // Quando o jogador encosta numa taça:
  coletarTaca(taca) {
    taca.disableBody(true, true)   // some do mapa
    estadoJogo.tacasColetadas++
    textoFlutuante(this, LARGURA_TELA / 2, ALTURA_TELA / 2 - 40, `Taça ${estadoJogo.tacasColetadas}/3`, '#ff9ccf')
    this.atualizarInterface()
  }

  // Abre o minijogo do hóspede por cima do hotel
  abrirMinijogo(dados) {
    const cenasDosDesafios = {
      quiz: 'CenaDesafioQuiz',
      memoria: 'CenaDesafioMemoria',
      reflexo: 'CenaDesafioReflexo'
    }

    this.pararJogador()
    this.scene.pause()
    this.scene.launch(cenasDosDesafios[dados.desafio.tipo], {
      personagem: dados,
      // Passa uma função para o minijogo chamar quando o jogador vencer
      aoVencer: () => this.vencerDesafio(dados)
    })
  }

  // Fala de vitória, recompensa e volta para a Dama
  vencerDesafio(dados) {
    this.dialogo.mostrar(dados.nome, dados.falaVitoria, () => {
      this.aplicarRecompensa(dados.recompensa)
      estadoJogo.etapa = 'voltarAoGerente'
      this.atualizarInterface()
      this.dialogo.mostrar('Recompensa!', [dados.recompensa.mensagem])
    })
  }

  // Aplica uma recompensa na ficha do jogador
  aplicarRecompensa(recompensa) {
    if (typeof recompensa.valor === 'boolean') {
      estadoJogo[recompensa.atributo] = recompensa.valor
    } else {
      estadoJogo[recompensa.atributo] += recompensa.valor
    }
    this.cameras.main.flash(300, 255, 220, 120)   // clarão amarelado
    textoFlutuante(this, LARGURA_TELA / 2, ALTURA_TELA / 2 - 40, recompensa.mensagem, '#ffcf5a')
  }

  // A PORTA DOS APOSENTOS (a passagem para o segundo loop)
  abrirPorta() {
    this.porta.setFrame(1)
    this.cameras.main.shake(400, 0.01)
  }

  // Chamado pelo collider quando o jogador encosta na porta
  tocarNaPorta() {
    if (estadoJogo.etapa === 'enfrentarMestre') {
      this.entrarNosAposentos()
      return
    }
    // Se a porta está trancada, avisa uma vez e de novo só depois de um tempinho
    if (this.avisouPortaTrancada) return
    this.avisouPortaTrancada = true
    this.dialogo.mostrar('', ['A porta está trancada. Uma plaquinha diz: "APOSENTOS DO MESTRE. Não perturbe."'], () => {
      this.time.delayedCall(2000, () => { this.avisouPortaTrancada = false })
    })
  }

  entrarNosAposentos() {
    if (this.entrandoNosAposentos) return
    this.entrandoNosAposentos = true
    this.pararJogador()

    this.cameras.main.fadeOut(900, 0, 0, 0)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('CenaCutscene', { id: 'confronto' })
    })
  }

  // HUD

  // Atualiza os textos de objetivo e atributos. Tem que chamar sempre que algo mudar
  atualizarInterface() {
    this.textoObjetivo.setText('Objetivo: ' + this.textoDoObjetivo())

    const e = estadoJogo   // apelido curto, só para caber na linha
    this.textoAtributos.setText(
      `VIDA ${e.vidaMaxima}   ATQ ${e.ataque}   DEF ${e.defesa}   CHAMP ${e.champanhes}`
    )
  }

  textoDoObjetivo() {
    const etapa = estadoJogo.etapa
    if (etapa === 'falarComGerente') return OBJETIVO_GERENTE
    if (etapa === 'voltarAoGerente') return OBJETIVO_VOLTAR
    if (etapa === 'enfrentarMestre') return OBJETIVO_MESTRE

    // etapa 'fazerDesafio'
    const missao = MISSOES[estadoJogo.missaoAtual]
    if (estadoJogo.buscaAtiva && missao.hospede === 'tiffany') {
      if (estadoJogo.tacasColetadas < 3) {
        return `Encontre as taças de champanhe rosa (${estadoJogo.tacasColetadas}/3)`
      }
      return 'Leve as taças para Madame Tiffany'
    }
    return missao.objetivo
  }
}