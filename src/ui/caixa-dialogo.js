// Caixa de diálogo

class CaixaDialogo {

    // O constructor roda uma vez
    constructor(cena) {
        this.cena = cena          // guarda a cena para usar deppis
        this.aberta = false       // a caixa está na tela?
        this.paginas = []         // os textos que ainda vão aparecer
        this.digitando = false    // ainda está digitando?
        this.aoTerminar = null    // função para chamar quando a conversa acabar

        // Medidas da caixa
        const margem = 5; // 5
        const largura = LARGURA_TELA - margem * 2
        const altura = 80; // 140
        const x = margem;
        const y = ALTURA_TELA - altura - margem

        // Fundo da caixa
        const fundo = desenharPainel(cena, x, y, largura, altura);

        // Nome de quem está falando
        this.textoNome = cena.add.text(x + 20, y - 40, '', {
            ...ESTILO_TEXTO,
            fontStyle: 'bold',
            color: CORES.textoDestaque,
            stroke: '#000000',
            strokeThickness: 5
        });

        // O texto da fala
        this.textoFala = cena.add.text(x + 20, y + 10, '', {
            ...ESTILO_TEXTO,
            lineSpacing: 6,
            wordWrap: { width: largura - 50, useAdvancedWrap: true }
        });

        // Setinha para passar o texto
        this.seta = cena.add.text(x + largura - 34, y + altura - 34, '▼', {
            ...ESTILO_TEXTO,
            color: CORES.textoDestaque
        });
        cena.tweens.add({
            targets: this.seta,
            alpha: 0.2,
            duration: 400,
            yoyo: true,     // vai e volta
            repeat: -1      // -1 = repete para sempre
        });

        // Deixa os parâmetros da caixa em um container
        this.container = cena.add.container(0, 0, [fundo, this.textoNome, this.textoFala, this.seta])
        // Trava a caixa na posição delimitada
        this.container.setScrollFactor(0)
        // Ordem de exibição da caixa
        this.container.setDepth(1000)
        this.container.setVisible(false)
    }

    // Inicia o diálogo
    mostrar(nome, paginas, aoTerminar = null) {
        this.textoNome.setText(nome)
        // Backup das falas
        this.paginas = paginas.slice()
        this.aoTerminar = aoTerminar
        this.aberta = true
        this.container.setVisible(true)
        this.proximaPagina()
    }

    // Acelera o texto da caixa ou passa para a próxima (igual em Pokémon)
    avancar() {
        if (!this.aberta) return;

        if (this.digitando) {
            this.completarTexto()
        } else {
            this.proximaPagina()
        }
    }

    // Mostra a próxima página, ou fecha se não tiver mais nenhuma
    proximaPagina() {
        // Realoca o texto das páginas
        const texto = this.paginas.shift()

        if (texto === undefined) {
            this.fechar();
            return;
        }
        this.digitarTexto(texto)
    }

    // Efeito de digitação com uma letra de cada vez
    digitarTexto(texto) {
        this.textoCompleto = this.textoFala.getWrappedText(texto).join('\n');
        this.letrasMostradas = 0
        this.textoFala.setText('')
        this.seta.setVisible(false)
        this.digitando = true

        // Passa direto o texto ignorando a digitação 
        if (this.timer) this.timer.remove()

        // Se o texto está vazio, então não tem nada para digitar
        if (this.textoCompleto.length === 0) {
            this.completarTexto();
            return;
        }

        // Um timer que roda a função callback várias vezes seguidas
        this.timer = this.cena.time.addEvent({
            delay: VELOCIDADE_TEXTO,
            repeat: this.textoCompleto.length - 1,
            callback: () => {
                this.letrasMostradas++
                // substring(0, n) = pedaço do texto do início até a letra n
                this.textoFala.setText(this.textoCompleto.substring(0, this.letrasMostradas))
                if (this.letrasMostradas >= this.textoCompleto.length) {
                    this.completarTexto()
                }
            }
        });
    }

    // Pula o efeito e mostra o texto inteiro de uma vez
    completarTexto() {
        if (this.timer) this.timer.remove()
        this.textoFala.setText(this.textoCompleto)
        this.digitando = false
        this.seta.setVisible(true)
    }

    // Esconde a caixa e avisa quem estava esperando o fim da conversa
    fechar() {
        this.aberta = false;
        this.container.setVisible(false)

        // Callback para encontrar a próxima caixa já limpa
        const callback = this.aoTerminar
        this.aoTerminar = null
        if (callback) callback()
    }
}