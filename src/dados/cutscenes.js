// Cutscenes do jogo

const CUTSCENES = {
    // Início do jogo
    abertura: {
        proximaCena: 'CenaHotel',
        quadros: [
            {
                imagem: 'abertura_1',
                texto: 'Uma estrada escura no meio do deserto. O vento frio bagunça o cabelo, os olhos pesam de sono... e o tanque, claro, está na reserva.'
            },
            {
                imagem: 'abertura_2',
                texto: 'Lá longe, uma luz tremeluzindo. Um letreiro em neon rosa: HOTEL CALAFRIO. Diária promocional. Vagas sempre disponíveis.'
            },
            {
                imagem: 'abertura_3',
                texto: 'Na porta, uma moça segurando uma vela. Um sino toca em algum lugar. "Isto aqui pode ser o paraíso... ou pode ser o contrário", você pensa.'
            },
            {
                imagem: 'abertura_4',
                texto: 'Ela guia você por um corredor comprido. Vozes chamam de todos os quartos. "Bem-vindo!", diz a Dama da Vela. "Aqui sempre cabe mais um."'
            }
        ]
    },

    // Encontro com a fera
    confronto: {
        proximaCena: 'CenaBatalha',
        quadros: [
            {
                imagem: 'batalha_fundo',
                texto: 'Espelhos no teto. Uma mesa de banquete posta para ninguém. E, no fundo do salão, algo muito grande respira devagar.'
            },
            {
                imagem: 'batalha_fundo',
                titulo: 'A FERA DOS APOSENTOS',
                texto: '"Facas de aço não me ferem", ruge a Fera. Ainda bem que você trouxe outra coisa...'
            }
        ]
    },

    // Encerramento com gancho para continuação
    final: {
        proximaCena: 'CenaCreditos',
        quadros: [
            {
                imagem: 'final_1',
                texto: 'O sino toca uma última vez e a porta de saída, enfim, se abre. Lá fora, o sol nasce. Dá para fazer check-out, sim. Basta querer muito.'
            },
            {
                imagem: 'final_2',
                texto: 'Na rodoviária, só um ônibus sai hoje: destino Brasília. No banco, alguém esqueceu uma carta assinada por um tal de "Santo Cristo".'
            },
            {
                imagem: 'final_3',
                texto: 'Dizem que no Planalto Central tem um duelo marcado. Sábado. Ao vivo, na TV. A cidade inteira vai assistir.'
            },
            {
                imagem: 'final_4',
                titulo: 'FAROESTE CABOCLO',
                texto: 'Continua no próximo jogo...'
            }
        ]
    }
}
