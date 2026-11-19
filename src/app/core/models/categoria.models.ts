export class CategoriaViewModel {
    constructor(categoriaID: string, categoriaPrincipalID: string, categoriaPrincipalIDUpdate: string, descricao: string, 
        tipo: string, situacao: string, usuarioOperacao: string, naturezaOperacao: string) {
        this.categoriaID = categoriaID;             
        this.categoriaPrincipalID = categoriaPrincipalID;
        this.categoriaPrincipalIDUpdate = categoriaPrincipalIDUpdate;
        this.descricao = descricao;
        this.tipo = tipo;
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    categoriaID: string;      
    categoriaPrincipalID: string;
    categoriaPrincipalIDUpdate: string;
    descricao: string;
    tipo: string;
    situacao: string;
    usuarioOperacao: string;
    naturezaOperacao: string;
}

export class CategoriaRetornoViewModel {
    categoriaID!: string;     
    categoriaPrincipalID!: string;
    descricao!: string;
    descCategoriaPrincipal!: string;
    tipo!: string;
    situacao!: string;
    usuarioOperacao!: string;
    naturezaOperacao!: string;
}

export class FiltroModalCategoriaViewModel {
    categoriaPrincipalID: string = "";
    descricao: string = "";
    tipo: string = "";
    situacao: string = "";
}

export class CategoriaFiltroGridViewModel {
    constructor(categoriaPrincipalID: string, descricao: string, tipo: string, situacao: string,offSet: string, pageSize: string,
        nomeColumn: string, sortDir: string) {
        this.categoriaPrincipalID = categoriaPrincipalID;
        this.descricao = descricao;
        this.tipo = tipo;
        this.situacao = situacao;        
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    categoriaPrincipalID: string;
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
    descricaoCategoriaPrincipal!: string;
    descricao!: string;
    tipo!: string;
    situacao!: string;
    totalRegistros!: string;
}