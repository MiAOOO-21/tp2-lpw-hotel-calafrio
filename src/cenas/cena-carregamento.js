// Script para carregar os arquivos do jogo
class CenaCarregamento extends Phaser.Scene {

    constructor() {
        // Este nome é usado para chamar a cena: this.scene.start('CenaCarregamento')
        super('CenaCarregamento')
    }

    preload() {
        this.criarBarraDeProgresso()

        // Se algum arquivo não existir, aviso no console em vez de travar
        this.load.on('loaderror', (arquivo) => {
            console.warn('Não consegui carregar:', arquivo.key, '->', arquivo.src)
        });

        // CUTSCENES: this.load.image(chave, caminhoDoArquivo)
        this.load.image('abertura_1', 'assets/cutscenes/abertura_1.jpg')
        this.load.image('abertura_2', 'assets/cutscenes/abertura_2.jpg')
        this.load.image('abertura_3', 'assets/cutscenes/abertura_3.jpg')
        this.load.image('abertura_4', 'assets/cutscenes/abertura_4.jpg')
        this.load.image('final_1', 'assets/cutscenes/final_1.jpg')
        this.load.image('final_2', 'assets/cutscenes/final_2.jpg')
        this.load.image('final_3', 'assets/cutscenes/final_3.jpg')
        this.load.image('final_4', 'assets/cutscenes/final_4.jpg')

        //Imagem do título
        this.load.image('titulo_fundo', 'assets/interface/titulo_fundo.jpg');
    }

    // Faz a barrinha de progresso
    criarBarraDeProgresso() {
        const centroX = LARGURA_TELA / 2
        const centroY = ALTURA_TELA / 2

        this.add.text(centroX, centroY - 50, 'Fazendo check-in...', ESTILO_TEXTO).setOrigin(0.5)

        const moldura = this.add.graphics()
        moldura.lineStyle(2, CORES.bordaCaixa)
        moldura.strokeRect(centroX - 200, centroY - 10, 400, 24)

        const barra = this.add.graphics()

        // Calcula e exibe o progresso do carregamento
        this.load.on('progress', (valor) => {
            barra.clear();
            barra.fillStyle(CORES.destaque);
            barra.fillRect(centroX - 196, centroY - 6, 392 * valor, 16)
        })
    }

    create() {
        const imagensSuaves = ['abertura_1', 'abertura_2', 'abertura_3', 'abertura_4',
            'final_1', 'final_2', 'final_3', 'final_4', 'titulo_fundo', 'batalha_fundo']
        imagensSuaves.forEach((chave) => {
            if (this.textures.exists(chave)) {
                this.textures.get(chave).setFilter(Phaser.Textures.FilterMode.LINEAR)
            }
        });

        // Se estiver tudo pronto, vai para a tela de título
        this.scene.start('CenaTitulo')
    }
}