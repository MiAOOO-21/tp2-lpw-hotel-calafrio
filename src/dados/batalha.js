// Dados da batalha com o boss

const DADOS_FERA = {
  nome: 'A Fera dos Aposentos',
  textura: 'boss_fera',
  vida: 100,
  ataque: 16,
  defesa: 3,
  resistencia: 0.25,

  // Quando tonta pelo sino, ela leva o dobro de dano.
  multiplicadorVulneravel: 2,

  // Chance (de 0 a 1) de a Fera começar a "Canção Hipnótica"
  chanceCancao: 0.3,
  // Quando ela está com menos da metade da vida, fica mais perigosa:
  chanceCancaoFuriosa: 0.5,

  // Dano multiplicado depois da canção
  multiplicadorBanquete: 2.5
}

const REGRAS_BATALHA = {
  curaChampanhe: 30,       // quanto um Champanhe Rosa cura
  turnosAtordoada: 3,      // quantos turnos o sino deixa a Fera atordoada
  recargaSino: 5,          // turnos até poder tocar o sino de novo
  reducaoDefender: 0.5,    // defendendo, você leva só 50% do dano
  pausaMensagem: 1100      // quanto tempo cada mensagem fica na tela
}
