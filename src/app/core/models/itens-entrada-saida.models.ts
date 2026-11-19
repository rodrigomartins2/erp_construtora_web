export class ItensEntradaPostViewModel {
    constructor(itemEntradaSaidaID: string, entradaSaidaID: string, produtoDescricaoID: string, estoqueID: string,quantidade: string, 
       valorUnitario: string, valorDesconto: string, valorSubTotal: string,valorTotal: string,operacao: string, 
       valorNota: string, dataUltimaCompra: string, naturezaOperacao: string, usuarioOperacao: string
    ) {
      this.itemEntradaSaidaID = itemEntradaSaidaID;
      this.entradaSaidaID = entradaSaidaID;
      this.produtoDescricaoID = produtoDescricaoID;
      this.estoqueID = estoqueID;
      this.quantidade = quantidade;
      this.valorUnitario = valorUnitario;
      this.valorDesconto = valorDesconto;
      this.valorSubTotal = valorSubTotal;
      this.valorTotal = valorTotal;
      this.operacao = operacao;
      this.valorNota = valorNota;
      this.dataUltimaCompra = dataUltimaCompra;
      this.naturezaOperacao = naturezaOperacao;
      this.usuarioOperacao = usuarioOperacao;    
    }
    itemEntradaSaidaID: string;
    entradaSaidaID: string;
    produtoDescricaoID: string;
    estoqueID: string;
    quantidade: string;
    valorUnitario: string;
    valorDesconto: string;
    valorSubTotal: string;
    valorTotal: string;
    operacao: string;
    valorNota: string;
    dataUltimaCompra: string;
    naturezaOperacao: string;
    usuarioOperacao: string;   
  }

  export class ItensSaidaPostViewModel {
    constructor(entradaSaidaID: string, estoqueProdutoID: string, quantidade: string, 
       valorUnitario: string, valorDesconto: string, valorSubTotal: string,valorTotal: string,
       naturezaOperacao: string, usuarioOperacao: string
    ) {
      this.entradaSaidaID = entradaSaidaID;
      this.estoqueProdutoID = estoqueProdutoID;    
      this.quantidade = quantidade;
      this.valorUnitario = valorUnitario;
      this.valorDesconto = valorDesconto;
      this.valorSubTotal = valorSubTotal;
      this.valorTotal = valorTotal;     
      this.naturezaOperacao = naturezaOperacao;
      this.usuarioOperacao = usuarioOperacao;    
    }
    
    entradaSaidaID: string;
    estoqueProdutoID: string;   
    quantidade: string;
    valorUnitario: string;
    valorDesconto: string;
    valorSubTotal: string;
    valorTotal: string;   
    naturezaOperacao: string;
    usuarioOperacao: string;   
  }

  export class GridItensEntradaSaidaViewModel {
    result!: any[];
    itemEntradaSaidaID!: string;
    entradaSaidaID!: string;
    produtoDescricaoID!: string;
    descricao!: string;
    quantidade!: string;
    valorUnitario!: string;    
    valorTotal!: string;
    totalRegistros!: string;
  }

  export class ItensEntradaSaidaFiltroGridViewModel {
    constructor(entradaSaidaID: number,offSet: string,pageSize: string,nomeColumn: string,sortDir: string
    ) {
      this.entradaSaidaID = entradaSaidaID;
      this.offSet = offSet;
      this.pageSize = pageSize;
      this.nomeColumn = nomeColumn;
      this.sortDir = sortDir;
    }  
    entradaSaidaID: number;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
  }

  export class ModalDadosEstoque {
    codigo: string = '';   
    estoqueID: string = ''; 
    data: string = '';
    operacao: string = '';
    valorTotal: string = '';
    numeroNota: string = '';
    movimentacaoRealizada: boolean = false;
}

export interface ItensProdutos {
  codigo: string;    
  descricao: string;
  quantidade: string;
}

export class MovimentarEstoqueViewModel {
  constructor(entradaSaidaID: string,estoqueID: string,dataUltimaCompra: string,operacao: string,
     naturezaOperacao: string,usuarioOperacao: string
  ) {   
    this.entradaSaidaID = entradaSaidaID;    
    this.estoqueID = estoqueID;
    this.dataUltimaCompra = dataUltimaCompra;
    this.operacao = operacao;
    this.naturezaOperacao = naturezaOperacao;
    this.usuarioOperacao = usuarioOperacao;    
  }
  entradaSaidaID: string;  
  estoqueID: string;
  dataUltimaCompra: string;  
  operacao: string;  
  naturezaOperacao: string;
  usuarioOperacao: string;   
}
