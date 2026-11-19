export class ProdutoDescricaoRetornoViewModel {  
  produtoDescricaoID!: string;
  marcaID!: string;
  marcaDescricao!: string;
  unidadeMedidaID!: string;
  produtoID!: string;
  produtoDescricao!: string;
  categoriaID!: string;
  categoriaDescricao!: string;
  subProduto!: string;
  descricaoProduto!: string;
  qtdeMinima!: string;
  saldo!: string;
  precoMedio!: string;
  situacao!: string;
  usuarioOperacao!: string;
  naturezaOperacao!: string;
}

export class ProdutoDescricaoViewModel {
  constructor(produtoDescricaoID: string,marcaID: string,unidadeMedidaID: string,produtoID: string,
    categoriaID: string,subProduto: string,descricao: string,
    qtdeMinima: string,situacao: string,usuarioOperacao: string,naturezaOperacao: string
  ) {
    this.produtoDescricaoID = produtoDescricaoID;
    this.marcaID = marcaID;
    this.unidadeMedidaID = unidadeMedidaID;
    this.produtoID = produtoID;
    this.categoriaID = categoriaID;
    this.subProduto = subProduto;
    this.descricao = descricao;
    this.qtdeMinima = qtdeMinima;
    this.situacao = situacao;
    this.usuarioOperacao = usuarioOperacao;
    this.naturezaOperacao = naturezaOperacao;
  }
  produtoDescricaoID: string;
  marcaID: string;
  unidadeMedidaID: string;
  produtoID: string;
  categoriaID: string;
  subProduto: string;
  descricao: string;
  qtdeMinima: string;
  situacao: string;
  usuarioOperacao: string;
  naturezaOperacao: string;
}

export class FiltroModalProdutoDescricaoViewModel {  
  marcaID: string = "";
  produtoID: string = "";
  categoriaID: string = "";
  subProduto: string = "";
  situacao: string = "";
}

export class ProdutoDescricaoFiltroGridViewModel {
  constructor(marcaID: string,produtoID: string,categoriaID: string,subProduto: string,situacao: string,offSet: string,
    pageSize: string,nomeColumn: string,sortDir: string
  ) {
    this.marcaID = marcaID;
    this.produtoID = produtoID;
    this.categoriaID = categoriaID;
    this.subProduto = subProduto;
    this.situacao = situacao;
    this.offSet = offSet;
    this.pageSize = pageSize;
    this.nomeColumn = nomeColumn;
    this.sortDir = sortDir;
  }
  marcaID: string;
  produtoID: string;
  categoriaID: string;
  subProduto: string;
  situacao: string;
  offSet: string;
  pageSize: string;
  nomeColumn: string;
  sortDir: string;
}

export class GridProdutoDescricaoViewModel {
  result!: any[];
  produtoDescricaoID!: string;
  marcaDescricao!: string;
  unidadeMedidaDescricao!: string;
  produtoDescricao!: string;
  categoriaDescricao!: string;
  subProduto!: string;
  qtdeMinima!: string;
  saldo!: string;
  situacao!: string;
  dataUltimaCompra!: string;
  totalRegistros!: string;
}
