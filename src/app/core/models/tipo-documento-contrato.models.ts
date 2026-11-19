export class TipoDocumentoContratoViewModel {
    constructor(tipoDocumentoContratoID: string, descricao: string, situacao: string, 
        usuarioOperacao: string, naturezaOperacao: string) {
        this.tipoDocumentoContratoID = tipoDocumentoContratoID;      
        this.descricao = descricao;
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    tipoDocumentoContratoID!: string;
    descricao!: string;
    situacao!: string;
    usuarioOperacao: string;
    naturezaOperacao: string;
}

export class TipoDocumentoContratoFiltroGridViewModel {
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

export class GridTipoDocumentoContratoViewModel {
    result!: any[];
    tipoDocumentoContratoID!: string;
    descricao!: string;
    situacao!: string;
    totalRegistros!: string;
}