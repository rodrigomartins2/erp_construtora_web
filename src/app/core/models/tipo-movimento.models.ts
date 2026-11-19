export class TipoMovimentoViewModel {
    constructor(tipoMovimentoID: string, historico: string, operacao: string, movimentarEstoque: boolean,
        geraPrevisao: boolean, geraDespesa: boolean, geraReceita: boolean, situacao: string, 
        usuarioOperacao: string, naturezaOperacao: string) {
        this.tipoMovimentoID = tipoMovimentoID;      
        this.historico = historico;
        this.operacao = operacao;
        this.movimentarEstoque = movimentarEstoque;
        this.geraPrevisao = geraPrevisao;
        this.geraDespesa = geraDespesa;
        this.geraReceita = geraReceita;
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    tipoMovimentoID!: string;
    historico!: string;
    operacao!: string;
    movimentarEstoque!: boolean;
    geraPrevisao!: boolean;
    geraDespesa!: boolean;
    geraReceita!: boolean;
    situacao!: string;
    usuarioOperacao: string;
    naturezaOperacao: string;
}

export class FiltroModalTipoMovimentoViewModel {
    historico: string = "";
    operacao: string = "";    
    situacao: string = "";
}

export class TipoMovimentoFiltroGridViewModel {
    constructor(historico: string, operacao: string, situacao: string,offSet: string, pageSize: string,
        nomeColumn: string, sortDir: string) {
        this.historico = historico;
        this.operacao = operacao;
        this.situacao = situacao;
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    } 
    
    historico!: string;
    operacao!: string;    
    situacao!: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridTipoMovimentoViewModel {
    result!: any[];
    tipoMovimentoID!: string;
    historico!: string;
    operacao!: string;
    movimentarEstoque!: string;
    geraPrevisao!: string;
    geraDespesa!: string;
    geraReceita!: string;
    situacao!: string;
    totalRegistros!: string;
}