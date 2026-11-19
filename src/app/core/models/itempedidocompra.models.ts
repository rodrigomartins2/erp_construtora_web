export class ItemPedidoCompraPostViewModel {
    constructor(itemPedidoCompraID: string, pedidoCompraID: string, produtoDescricaoID: string, quantidade: string,
        valorUnitario: string, valorTotal: string, naturezaOperacao: string, usuarioOperacao: string) {
     
      this.itemPedidoCompraID = itemPedidoCompraID;
      this.pedidoCompraID = pedidoCompraID;
      this.produtoDescricaoID = produtoDescricaoID;
      this.quantidade = quantidade;
      this.valorUnitario = valorUnitario;
      this.valorTotal = valorTotal;     
      this.naturezaOperacao = naturezaOperacao;
      this.usuarioOperacao = usuarioOperacao;    
    }
    itemPedidoCompraID: string;
    pedidoCompraID: string;
    produtoDescricaoID: string;
    quantidade: string;
    valorUnitario: string;
    valorTotal: string;
    naturezaOperacao: string;
    usuarioOperacao: string;
  }

  export class GridItemPedidoCompraViewModel {
    result!: any[];
    itemPedidoCompraID!: string;
    produto!: string;
    quantidade!: string;
    valorUnitario!: string;
    valorTotal!: string;    
    totalRegistros!: string;
  }

  export class ItemPedidoCompraFiltroGridViewModel {
    constructor(pedidoCompraID: string,offSet: string,pageSize: string,nomeColumn: string,sortDir: string
    ) {
      this.pedidoCompraID = pedidoCompraID;
      this.offSet = offSet;
      this.pageSize = pageSize;
      this.nomeColumn = nomeColumn;
      this.sortDir = sortDir;
    }  
    pedidoCompraID: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
  }

  export class ItemPedidoCompraRetornoViewModel{
    itemPedidoCompraID!: string;
    produtoDescricaoID!: string;
    produto!: string;
    quantidade!: string;
    valorUnitario!: string;
    valorTotal!: string;    
  }
