// Funções para uso nas cenas

// Tempo de espera entre cutscenes
function esperar(cena, milissegundos) {
  return new Promise((resolve) => {
    cena.time.delayedCall(milissegundos, resolve)
  })
}

// Fundo das caixas de diálogo
function desenharPainel(cena, x, y, largura, altura) {
  const painel = cena.add.graphics()
  painel.fillStyle(CORES.fundoCaixa, 0.62)           // cor e transparência
  painel.fillRoundedRect(x, y, largura, altura, 30)   // 30 = raio dos cantos
  painel.lineStyle(2, CORES.bordaCaixa, 0)            // espessura, cor, opacidade
  painel.strokeRoundedRect(x, y, largura, altura, 30)
  return painel
}

// Barra de vida
function desenharBarra(graficos, x, y, largura, altura, atual, maximo, cor) {
  graficos.clear()
  // Fundo da barra
  graficos.fillStyle(0x000000, 0.7)
  graficos.fillRect(x, y, largura, altura)
  // Parte cheia usando regra de três (atual / maximo) dá um número entre 0 e 1
  const proporcao = Phaser.Math.Clamp(atual / maximo, 0, 1)
  graficos.fillStyle(cor, 1)
  graficos.fillRect(x + 2, y + 2, (largura - 4) * proporcao, altura - 4)
  // Contorno
  graficos.lineStyle(2, 0xffffff, 0.8)
  graficos.strokeRect(x, y, largura, altura)
}

// Texto que aparece e some rápido
function textoFlutuante(cena, x, y, mensagem, cor = '#ffffff') {
  const texto = cena.add.text(x, y, mensagem, {
    ...ESTILO_TEXTO,            // "..." copia o estilo padrão
    fontSize: '28px',
    fontStyle: 'bold',
    color: cor,
    stroke: '#000000',
    strokeThickness: 5
  }).setOrigin(0.5).setDepth(2000).setScrollFactor(0)

  // animação sobe e some
  cena.tweens.add({
    targets: texto,
    y: y - 50,
    alpha: 0,
    duration: 900,
    ease: 'Cubic.easeOut',
    onComplete: () => texto.destroy()
  })
}
