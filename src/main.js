//Principal arquivo do jogo
console.log('jogo carregado')

const CONFIGURACAO = {
    type: Phaser.WEBGL, //faz o Phaser usar a placa de vídeo
    parent: 'jogo', //esse é o id que está no index para o Phaser criar o canvas
    width: LARGURA_TELA,
    height: ALTURA_TELA,
    backgroundColor: '#000000',
    pixelArt: true, //liga a interpolação Nearest Neighbor
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }, // centraliza e altera o tamanho do canvas para caber na tela
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: MODO_DEBUG
        }
    }, //ativa a física no jogo (sem gravidade)

    //lista de cenas
    scene: [
        CenaCarregamento,
        CenaTitulo//,
        //CenaCutscene,
        //CenaHotel,
        //CenaDesafioQuiz,
        //CenaDesafioMemoria,
        //CenaDesafioReflexo,
        //CenaBatalha,
        //CenaCreditos
    ]
}

//Cria o jogo
window.jogo = new Phaser.Game(CONFIGURACAO)

console.log(CONFIGURACAO.pixelArt)