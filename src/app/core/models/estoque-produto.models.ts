export class EstoqueProdutoViewModel {
    constructor(estoqueProdutoID: string, estoqueID: string, produtoDescricaoID: string, qtdeMinima: string, situacao: string,
        usuarioOperacao: string, naturezaOperacao: string) {
          this.estoqueProdutoID = estoqueProdutoID;
      this.estoqueID = estoqueID;
      this.produtoDescricaoID = produtoDescricaoID;
      this.qtdeMinima = qtdeMinima;
      this.qtdeMinima = qtdeMinima;
      this.situacao = situacao;
      this.usuarioOperacao = usuarioOperacao;
      this.naturezaOperacao = naturezaOperacao;
    }
    estoqueProdutoID: string;
    estoqueID: string;
    produtoDescricaoID: string;
    qtdeMinima: string;
    situacao: string;
    usuarioOperacao: string;
    naturezaOperacao: string;
  } 

  export class FiltroModalEstoqueProdutoViewModel {    
    estoqueID: string = "";
    produtoDescricaoID: string = "";
    situacao: string = "";
  }

  export class EstoqueProdutoFiltroGridViewModel {
    constructor(
      estoqueID: string,
      produtoDescricaoID: string,
      situacao: string,
      offSet: string,
      pageSize: string,
      nomeColumn: string,
      sortDir: string
    ) {
      this.estoqueID = estoqueID;
      this.produtoDescricaoID = produtoDescricaoID;
      this.situacao = situacao;
      this.offSet = offSet;
      this.pageSize = pageSize;
      this.nomeColumn = nomeColumn;
      this.sortDir = sortDir;
    }
    estoqueID: string;
    produtoDescricaoID: string;
    situacao: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
  }

  export class EstoqueProdutoRetornoViewModel {  
    estoqueProdutoID!: string;
    estoqueID!: string;
    nomeEstoque!: string;
    produtoDescricaoID!: string;
    produtoDescricao!: string;
    qtdeMinima!: string;   
    marcaID!: string;
    marcaDescricao!: string;
    unidadeMedidaID!: string;
    produtoID!: string;   
    produto!: string;
    categoriaID!: string;
    categoriaDescricao!: string;
    subProduto!: string;
    descricaoProduto!: string;   
    saldo!: string;
    precoMedio!: string;
    situacao!: string;
    usuarioOperacao!: string;
    naturezaOperacao!: string;
  }