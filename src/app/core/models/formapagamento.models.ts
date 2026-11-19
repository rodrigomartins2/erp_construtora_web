export class FormaPagamentoViewModel {
    constructor(formaPagamentoID: string,  descricao: string, situacao: string, 
        usuarioOperacao: string, naturezaOperacao: string) {
        this.formaPagamentoID = formaPagamentoID;      
        this.descricao = descricao;  
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    formaPagamentoID: string;   
    descricao: string;
    situacao: string;
    usuarioOperacao: string;
    naturezaOperacao: string;
}

export class FormaPagamentoFiltroGridViewModel {
    constructor(descricao: string, situacao: string,offSet: string, pageSize: string,
        nomeColumn: string, sortDir: string) {
        this.descricao = descricao;
        this.situacao = situacao;
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    
    descricao: string;
    situacao: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridFormaPagamentoViewModel {
    result!: any[];
    formaPagamentoID!: string;
    descricao!: string;    
    situacao!: string;
    totalRegistros!: string;
}