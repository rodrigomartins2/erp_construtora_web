export class EntradaSaidaRetornoViewModel {    
        entradaSaidaID!: string;
        tipoMovimentoID!: string;
        pessoaID!: string;
        nomeCliente!: string;
        serie!: string;
        numeroNota!: string;
        dataMovimento!: string;
        dataEmissao!: string;
        especie!: string;
        valor!: string;
        valorDesconto!: string;
        valorAcrescimo!: string;
        descricao!: string;
        observacao!: string;
        valorAcessorios!: string;
        valorFrete!: string;
        valorICMSSubstituicao!: string;
        valorIPI!: string; 
        valorTotal!: string;
        dataEntregaProduto!: string;
        situacao!: string;
        operacao!: string;
        movimentacaoRealizada!: string;
        dataMovimentacao!: string;
        usuarioMovimentacao!: string;
}

export class EntradaPostViewModel {
  constructor(entradaSaidaID: string,tipoMovimentoID: string,pessoaID: string,estoqueID: string,serie: string,
    numeroNota: string,dataMovimento: string,dataEmissao: string,valor: string,valorDesconto: string,
    valorAcrescimo: string,descricao: string,observacao: string,valorFrete: string,
    valorICMSSubstituicao: string,valorIPI: string,valorTotal: string,situacao: string,
    operacao: string,naturezaOperacao: string,usuarioOperacao: string
  ) {
    this.entradaSaidaID = entradaSaidaID
    this.tipoMovimentoID = tipoMovimentoID
    this.pessoaID = pessoaID;
    this.estoqueID = estoqueID;
    this.serie = serie;
    this.numeroNota = numeroNota;
    this.dataMovimento = dataMovimento;
    this.dataEmissao = dataEmissao;    
    this.valor = valor;
    this.valorDesconto = valorDesconto;
    this.valorAcrescimo = valorAcrescimo;
    this.descricao = descricao;
    this.observacao = observacao;
    this.valorFrete = valorFrete;
    this.valorICMSSubstituicao = valorICMSSubstituicao;
    this.valorIPI = valorIPI; 
    this.valorTotal = valorTotal;
    this.situacao = situacao;
    this.operacao = operacao;
    this.naturezaOperacao = naturezaOperacao;
    this.usuarioOperacao = usuarioOperacao;    
  }
    entradaSaidaID: string;
    tipoMovimentoID: string;
    pessoaID: string; 
    estoqueID: string;    
    serie: string;
    numeroNota: string;    
    dataMovimento: string
    dataEmissao: string;
    valor: string;
    valorDesconto: string;
    valorAcrescimo: string;
    descricao: string;
    observacao: string;
    valorFrete: string;
    valorICMSSubstituicao: string;
    valorIPI: string; 
    valorTotal: string;
    situacao: string;
    operacao: string;
    naturezaOperacao: string;
    usuarioOperacao: string;
}

export class SaidaPostViewModel {
  constructor(entradaSaidaID: string,tipoMovimentoID: string,pessoaID: string,obraID: string, 
    dataMovimento: string,descricao: string,observacao: string,situacao: string,
    operacao: string,naturezaOperacao: string,usuarioOperacao: string
  ) {
    this.entradaSaidaID = entradaSaidaID
    this.tipoMovimentoID = tipoMovimentoID 
    this.pessoaID = pessoaID;
    this.obraID = obraID;   
    this.dataMovimento = dataMovimento;
    this.descricao = descricao;
    this.observacao = observacao;  
    this.situacao = situacao;
    this.operacao = operacao;
    this.naturezaOperacao = naturezaOperacao;
    this.usuarioOperacao = usuarioOperacao;    
  }
    entradaSaidaID: string;
    tipoMovimentoID: string;
    pessoaID: string;
    obraID: string;
    dataMovimento: string
    descricao: string;
    observacao: string;
    situacao: string;
    operacao: string;
    naturezaOperacao: string;
    usuarioOperacao: string;
}

export class FiltroModalEntradaSaidaViewModel {
  pessoaID: any = "";
  numeroNota: string = "";
  dataMovimentoIni: string = "";
  dataMovimentoFim: string = "";
  dataEmissaoIni: string = "";
  dataEmissaoFim: string = "";
  situacao: string = "";
  operacao: string = "";
}

export class EntradaSaidaFiltroGridViewModel {
  constructor(pessoaID: number,numeroNota: string,dataMovimentoIni: string,
    dataMovimentoFim: string,dataEmissaoIni: string,dataEmissaoFim: string,situacao: string,operacao: string, 
    offSet: string,pageSize: string,nomeColumn: string,sortDir: string
  ) {
    this.pessoaID = pessoaID;
    this.numeroNota = numeroNota;    
    this.dataMovimentoIni = dataMovimentoIni;
    this.dataMovimentoFim = dataMovimentoFim;
    this.dataEmissaoIni = dataEmissaoIni;    
    this.dataEmissaoFim = dataEmissaoFim;    
    this.situacao = situacao;
    this.operacao = operacao;
    this.offSet = offSet;
    this.pageSize = pageSize;
    this.nomeColumn = nomeColumn;
    this.sortDir = sortDir;
  }  
  pessoaID: number;
  numeroNota: string;
  dataMovimentoIni: string;
  dataMovimentoFim: string;
  dataEmissaoIni: string;
  dataEmissaoFim: string;
  situacao: string;
  operacao: string;
  offSet: string;
  pageSize: string;
  nomeColumn: string;
  sortDir: string;
}

export class GridEntradaSaidaViewModel {
  result!: any[];
  entradaSaidaID!: string;  
  clienteFornecedor!: string;
  numeroNota!: string;
  valorTotal!: string;
  dataMovimento!: string;
  dataEmissao!: string;
  situacao!: string;
  operacao!: string;
  movimentacaoRealizada!: string;
  totalRegistros!: string;
}

