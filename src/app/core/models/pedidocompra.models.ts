export class PedidoCompraRetornoViewModel {
  pedidoCompraID!: string;
  pessoaID!: string;
  clienteFornecedo!: string;
  estoqueID!: string;
  obraID!: string;
  dataPedido!: string;
  valor!: string;
  valorFrete!: string;
  valorTotal!: string;
  usuarioAprovacao!: string;
  dataAprovacao!: string;
  usuarioComprador!: string;
  dataCotacao!: string;
  totalItens!: string;
  dataEntrega!: string;
  formaPagamento!: string;
  observacao!: string;
}

export class PedidoCompraPostViewModel {
  constructor(
    pedidoCompraID: string,
    pessoaID: string,
    estoqueID: string,
    obraID: string,
    dataPedido: string,
    valorFrete: string,
    uUsuarioComprador: string,
    dataCotacao: string,
    dataEntrega: string,
    formaPagamentoID: string,
    observacao: string,
    naturezaOperacao: string,
    usuarioOperacao: string
  ) {
    this.pedidoCompraID = pedidoCompraID;
    this.pessoaID = pessoaID;
    this.estoqueID = estoqueID;
    this.obraID = obraID;
    this.dataPedido = dataPedido;
    this.valorFrete = valorFrete;
    this.uUsuarioComprador = uUsuarioComprador;
    this.dataCotacao = dataCotacao;
    this.dataEntrega = dataEntrega;
    this.formaPagamentoID = formaPagamentoID;
    this.observacao = observacao;
    this.naturezaOperacao = naturezaOperacao;
    this.usuarioOperacao = usuarioOperacao;
  }
  pedidoCompraID: string;
  pessoaID: string;
  estoqueID: string;
  obraID: string;
  dataPedido: string;
  valorFrete: string;
  uUsuarioComprador: string;
  dataCotacao: string;
  dataEntrega: string;
  formaPagamentoID: string;
  observacao: string;
  naturezaOperacao: string;
  usuarioOperacao: string;
}

export class FiltroModalPedidoCompraViewModel {  
  pessoaID: string;
  numeroPedido: string;
  estoqueID: string;
  obraID: string;
  dataPedidoInicio: string;
  dataPedidoFim: string;
  dataAprovacaoInicio: string;
  dataAprovacaoFim: string;
}

export class PedidoCompraFiltroGridViewModel {
  constructor(
    pessoaID: string,
    numeroPedido: string,
    estoqueID: string,
    obraID: string,
    dataPedidoInicio: string,
    dataPedidoFim: string,
    dataAprovacaoInicio: string,
    dataAprovacaoFim: string,
    offSet: string,
    pageSize: string,
    nomeColumn: string,
    sortDir: string
  ) {
    this.pessoaID = pessoaID;
    this.numeroPedido = numeroPedido;
    this.estoqueID = estoqueID;
    this.obraID = obraID;
    this.dataPedidoInicio = dataPedidoInicio;
    this.dataPedidoFim = dataPedidoFim;
    this.dataAprovacaoInicio = dataAprovacaoInicio;
    this.dataAprovacaoFim = dataAprovacaoFim;
    this.offSet = offSet;
    this.pageSize = pageSize;
    this.nomeColumn = nomeColumn;
    this.sortDir = sortDir;
  }
  pessoaID: string;
  numeroPedido: string;
  estoqueID: string;
  obraID: string;
  dataPedidoInicio: string;
  dataPedidoFim: string;
  dataAprovacaoInicio: string;
  dataAprovacaoFim: string;
  offSet: string;
  pageSize: string;
  nomeColumn: string;
  sortDir: string;
}

export class GridEntradaSaidaViewModel {
  result!: any[];
  pedidoCompraID!: string;
  clienteFornecedor!: string;
  dataPedido!: string;
  dataAprovacao!: string;
  dataCotacao!: string;
  valorTotal!: string;
  totalItens!: string;
  totalRegistros!: string;
}

export class PedidoCompraAlterarViewModel {
  constructor(
    pedidoCompraID: string,
    valorTotal: string,
    usuarioAprovacao: string,
    dataAprovacao: string,
    totalItens: string,
    naturezaOperacao: string,
    usuarioOperacao: string
  ) {
    this.pedidoCompraID = pedidoCompraID;
    this.valorTotal = valorTotal;
    this.usuarioAprovacao = usuarioAprovacao;
    this.dataAprovacao = dataAprovacao;
    this.totalItens = totalItens;
    this.naturezaOperacao = naturezaOperacao;
    this.usuarioOperacao = usuarioOperacao;
  }
  pedidoCompraID: string;
  valorTotal: string;
  usuarioAprovacao: string;
  dataAprovacao: string;
  totalItens: string;
  naturezaOperacao: string;
  usuarioOperacao: string;
}
