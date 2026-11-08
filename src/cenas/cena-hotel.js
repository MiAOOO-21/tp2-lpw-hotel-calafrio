// Loop de exploração do Hotel
// Tá tudo aqui, não consegui dividir ainda

class CenaHotel extends Phaser.Scene {

  constructor() {
    super('CenaHotel');
  }

  // Monta a cena, roda uma vez
  create() {
    this.entrandoNosAposentos = false;   // evita entrar na porta duas vezes
    this.avisouPortaTrancada = false;    // evita repetir o aviso da porta
    this.direcao = 'baixo';              // para onde o jogador está virado

    this.criarMapa();

    this.cameras.main.fadeIn(600);
  }

  //Carrega o mapa do Tiled e cria as camadas
  criarMapa() {
    // Cria o mapa a partir do JSON carregado com a chave 'mapa_hotel'
    this.mapa = this.make.tilemap({ key: 'mapa_hotel' });

    // Liga o tileset do Tiled na imagem carregada
    const tileset = this.mapa.addTilesetImage('tileset', 'tileset');

    // Cria as camadas visuais de baixo primeiro
    this.camadaChao = this.mapa.createLayer('Chao', tileset);
    this.camadaParedes = this.mapa.createLayer('Paredes', tileset);

    // Todos os tiles que têm a propriedade "colide = true" no Tiled passam a ser sólidos
    this.camadaParedes.setCollisionByProperty({ colide: true });

    // O mundo da física tem o tamanho do mapa
    this.physics.world.setBounds(0, 0, this.mapa.widthInPixels, this.mapa.heightInPixels);
  }
}