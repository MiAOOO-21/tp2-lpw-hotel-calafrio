//Estado inicial do jogo

let estadoJogo = criaEstadoInicial()

//Cria um save novo para o jogo
function criaEstadoInicial() {
    return {
        //Atributos do jogador
        vidaMaxima: 60,
        ataque: 8,
        defesa: 2,
        champanhe: 0,
        temSino: false,

        //Progresso das missões
        missaoAtual: 0,
        etapa: 'falarComGerente',
        buscaAtiva: false,
        tacasColetada: 0
    }
}

//Apaga o progresso do save antigo
function reiniciarEstado() {
    estadoJogo = criaEstadoInicial()
}

console.log('Estado Carregado')