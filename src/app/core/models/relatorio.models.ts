export class FiltroRelPosicaoEstoqueViewModel {
    constructor(estoqueID: string, dataIncio: string, dataFim: string) {
      this.estoqueID = estoqueID;
      this.dataIncio = dataIncio;
      this.dataFim = dataFim;
    }
    estoqueID: string;
    dataIncio: string;
    dataFim: string;
  }