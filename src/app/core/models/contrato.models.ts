export class ContratoPostViewModel {
    constructor(contratoID: string,pessoaID: string, empresaPessoaID: string, numeroContrato: string,
        dataInicioContrato: string,dataFimContrato: string,descricao: string,observacao: string,situacao: string,
        valorContrato: string,pessoaResponsavelContratoID: string,naturezaOperacao: string, usuarioOperacao: string) {
            this.contratoID = contratoID;
            this.pessoaID = pessoaID;
            this.empresaPessoaID = empresaPessoaID;
            this.numeroContrato = numeroContrato;
            this.dataInicioContrato = dataInicioContrato;
            this.dataFimContrato = dataFimContrato;           
            this.descricao = descricao;
            this.observacao = observacao;
            this.situacao = situacao;            
            this.valorContrato = valorContrato;
            this.pessoaResponsavelContratoID = pessoaResponsavelContratoID;   
            // this.nomeDocumento = nomeDocumento;
            // this.arquivo = arquivo;
            // this.situacaoDocumento = situacaoDocumento;
            this.naturezaOperacao = naturezaOperacao;
            this.usuarioOperacao = usuarioOperacao;         
    }
    contratoID: string;
    pessoaID: string;
    empresaPessoaID: string
    numeroContrato: string;
    dataInicioContrato: string;	
    dataFimContrato: string;    
    descricao: string;
    observacao: string;
    situacao: string;
    valorContrato: string;
    pessoaResponsavelContratoID: string;
    // nomeDocumento: string;
    // arquivo: string;
    // situacaoDocumento: string;
    naturezaOperacao: string;
    usuarioOperacao: string;
}

export class ContratoRetornoViewModel {   
    contratoID!: string;
    pessoaID!: string;
    empresaPessoaID!: string
    numeroContrato!: string;
    nomePessoa!: string; 
    dataInicioContrato!: string;	
    dataFimContrato!: string;
    dataInicioAditivo!: string;
    dataFimAditivo!: string;
    descricao!: string;
    observacao!: string;
    situacao!: string;
    valorContrato!: string;
    dataFinalizacaoContrato!: string;
    pessoaResponsavelContratoID!: string;
    NomeResponsavel!: string;    
}

export class FiltroModalContratoViewModel {   
    pessoaID: string = "";
    empresaPessoaID: string = "";
    dataInicioContrato: string = "";
    dataFimContrato: string = "";
    situacao: string = "";
}

export class ContratoFiltroGridViewModel {
    constructor(pessoaID: string,empresaPessoaID: string,dataInicioContrato: string,dataFimContrato: string, situacao: string,
        offSet: string, pageSize: string,nomeColumn: string, sortDir: string) {
        this.pessoaID = pessoaID;
        this.empresaPessoaID = empresaPessoaID;
        this.dataInicioContrato = dataInicioContrato;
        this.dataFimContrato = dataFimContrato;
        this.situacao = situacao;        
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    pessoaID: string;
    empresaPessoaID: string
    dataInicioContrato: string;
    dataFimContrato: string;
    situacao: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridContratoViewModel {
    result!: any[];
    contratoID!: string;
    pessoaID!: string;
    numeroContrato!: string;
    nomeEmpresa!: string;
    pessoaResponsavelContratoID!: string;
    pessoaResponsavelContrato!: string;
    dataInicioContrato!: string;	
    descricao!: string;
    situacao!: string;
    dataFinalizacaoContrato!: string;
    contr!: string;
    os!: string;
    art!: string;
    cno!: string;
    seg!: string;
    ta!: string;
    fin!: string;
    trd!: string;
    atest!: string;
    totalRegistros!: string;
}

export class FinalizarContratoViewModel {
    constructor(contratoID: string,dataFinalizacaoContrato: string, observacaoFinalizacao: string, 
                usuarioOperacao: string) {
            this.contratoID = contratoID;
            this.dataFinalizacaoContrato = dataFinalizacaoContrato;
            this.observacaoFinalizacao = observacaoFinalizacao;
            this.usuarioOperacao = usuarioOperacao;         
    }
    contratoID: string;
    dataFinalizacaoContrato: string;
    observacaoFinalizacao: string   
    usuarioOperacao: string;
}

