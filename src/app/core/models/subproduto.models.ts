export class CategoriaViewModel {
    constructor(categoriaID: string,  descricao: string, tipo: string, situacao: string, 
        usuarioOperacao: string, naturezaOperacao: string) {
        this.categoriaID = categoriaID;      
        this.descricao = descricao;
        this.tipo = tipo;
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    categoriaID: string;   
    descricao: string;
    tipo: string;
    situacao: string;
    usuarioOperacao: string;
    naturezaOperacao: string;

}

export class CategoriaFiltroGridViewModel {
    constructor(descricao: string, tipo: string, situacao: string,offSet: string, pageSize: string,
        nomeColumn: string, sortDir: string) {
        this.descricao = descricao;
        this.tipo = tipo;
        this.situacao = situacao;        
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    descricao: string;
    tipo: string;
    situacao: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridCategoriaViewModel {
    result!: any[];
    categoriaID!: string;
    descricao!: string;
    tipo!: string;
    situacao!: string;
    totalRegistros!: string;
}