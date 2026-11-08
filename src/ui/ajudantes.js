// Funções para uso nas cenas

// Tempo de espera entre cutscenes
function esperar(cena, milissegundos) {
  return new Promise((resolve) => {
    cena.time.delayedCall(milissegundos, resolve)
  });
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