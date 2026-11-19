export class ProdutoViewModel {
    constructor(produtoID: string, categoriaID: string,  descricao: string, situacao: string, 
        usuarioOperacao: string, naturezaOperacao: string) {
        this.produtoID = produtoID;
        this.categoriaID = categoriaID;      
        this.descricao = descricao;
        this.situacao = situacao;
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }
    produtoID: string;
    categoriaID: string;   
    descricao: string;
    situacao: string;
    usuarioOperacao: string;
    naturezaOperacao: string;
}

export class FiltroModalProdutoViewModel {
    categoriaID: string = "";
    descricaoProduto: string = "";
    situacao: string = "";
}

export class ProdutoFiltroGridViewModel {
    constructor(categoriaID: string, descricaoProduto: string, situacao: string,offSet: string, pageSize: string,
        nomeColumn: string, sortDir: string) {
        this.categoriaID = categoriaID;
        this.descricaoProduto = descricaoProduto;
        this.situacao = situacao;        
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    categoriaID: string;
    descricaoProduto: string;
    situacao: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridProdutoViewModel {
    result!: any[];
    produtoID!: string;
    descricaoProduto!: string;
    descricaoCategoria!: string;
    situacao!: string;
    totalRegistros!: string;
}