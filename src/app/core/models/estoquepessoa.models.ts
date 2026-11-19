export class EstoquePessoaPostViewModel {
    constructor(estoquePessoaID: string,pessoaID: string, situacao: string,
        pessoaResponsavelEstoquePessoaID: string,naturezaOperacao: string, usuarioOperacao: string) {
            this.estoquePessoaID = estoquePessoaID;
            this.pessoaID = pessoaID;            
            this.situacao = situacao;            
            
            this.naturezaOperacao = naturezaOperacao;
            this.usuarioOperacao = usuarioOperacao;         
    }
    estoquePessoaID: string;
    pessoaID: string;
    situacao: string;
    naturezaOperacao: string;
    usuarioOperacao: string;
}

export class EstoquePessoaRetornoViewModel {   
    estoquePessoaID!: string;
    pessoaID!: string;
    situacao!: string;
    dataFinalizacaoEstoquePessoa!: string;
    pessoaResponsavelEstoquePessoaID!: string;
    NomeResponsavel!: string;    
}

export class EstoquePessoaFiltroGridViewModel {
    constructor(pessoaID: string, situacao: string,
        offSet: string, pageSize: string,nomeColumn: string, sortDir: string) {
        this.pessoaID = pessoaID;
        this.situacao = situacao;        
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    pessoaID: string;   
    situacao: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridEstoquePessoaViewModel {
    result!: any[];
    estoquePessoaID!: string;
    pessoaID!: string;
    nomeFantasia!: string;
    situacao!: string;
    totalRegistros!: string;
}

