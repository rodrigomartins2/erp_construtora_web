export class UnidadesMedidaViewModel {
    constructor(unidadeMedidaID: string,  descricao: string, abreviacao: string, situacao: string, 
        usuarioOperacao: string, naturezaOperacao: string) {
        this.unidadeMedidaID = unidadeMedidaID;      
        this.descricao = descricao;
        this.abreviacao = abreviacao;
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    unidadeMedidaID: string;   
    descricao: string;
    abreviacao: string;
    situacao: string;
    usuarioOperacao: string;
    naturezaOperacao: string;

}

export class FiltroModalUnidadesMedidaViewModel {
    descricao: string = "";
    situacao: string = "";
}

export class UnidadesMedidaFiltroGridViewModel {
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

export class UnidadesMedidaFormViewModel {  
    descricao!: string;
    abreviacao!: string;
    situacao!: string;
}

export class GridUnidadesMedidaViewModel {
    result!: any[];
    unidadeMedidaID!: string;
    descricao!: string;
    abreviacao!: string;
    situacao!: string;
    totalRegistros!: string;
}