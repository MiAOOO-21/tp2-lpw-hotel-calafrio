// Configurações do jogo
console.log('configurações carregadas')

//Tamanho da tela
const LARGURA_TELA = 960
const ALTURA_TELA = 540

const TAMANHO_TILE = 32

const VELOCIDADE_JOGADOR = 150

const DISTANCIA_CONVERSA = 70

//Velocidade de digitação dos textos
const VELOCIDADE_TEXTO = 25

//Faz o Phaser mostrar as caixas de colisão
const MODO_DEBUG = false

const CORES = {
    fundoCaixa: 0x120812, //fundo das caixas de texto
    bordaCaixa: 0xe8b04a, //borda amarela (só se precisar)
    destaque: 0xff5a8c, //rosa neon do hotel
    vida: 0x4ad66d, //barra de vida verde
    vidaBoss: 0xd63a4a, //barra de vida do chefão
    texto: '#f4e9d8', //cor do texto
    textoDestaque: '#ffcf5a' //cor do texto destacado
}

const ESTILO_TEXTO = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '20px',
    color: CORES.texto
}

console.log(MODO_DEBUG)