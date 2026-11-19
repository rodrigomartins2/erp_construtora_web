export class MarcaViewModel {
    constructor(marcaID: string,  descricao: string, situacao: string, 
        usuarioOperacao: string, naturezaOperacao: string) {
        this.marcaID = marcaID;      
        this.descricao = descricao;  
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    marcaID: string;   
    descricao: string;
    situacao: string;
    usuarioOperacao: string;
    naturezaOperacao: string;
}

export class FiltroMarcaViewModel {
    descricao: string;
    situacao: string;
}

export class MarcaFiltroGridViewModel {
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

export class GridMarcaViewModel {
    result!: any[];
    marcaID!: string;
    descricao!: string;    
    situacao!: string;
    totalRegistros!: string;
}