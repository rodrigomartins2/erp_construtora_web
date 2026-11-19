export class CategoriaPrincipalViewModel {
    constructor(categogiaPrincipalID: string,  descricao: string, tipo: string, situacao: string, 
        usuarioOperacao: string, naturezaOperacao: string) {
        this.categogiaPrincipalID = categogiaPrincipalID;      
        this.descricao = descricao;
        this.tipo = tipo;
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    categogiaPrincipalID: string;   
    descricao: string;
    tipo: string;
    situacao: string;
    usuarioOperacao: string;
    naturezaOperacao: string;

}

export class CategoriaPrincipalFiltroGridViewModel {
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

export class GridCategoriaPrincipalViewModel {
    result!: any[];
    categogiaPrincipalID!: string;
    descricao!: string;
    tipo!: string;
    situacao!: string;
    totalRegistros!: string;
}