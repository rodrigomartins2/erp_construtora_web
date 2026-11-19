export class PessoaViewModel {
    constructor(pessoaID: string, tipoPessoa: string, subTipoPessoa: string, nome: string, nomeFantasia: string,
                cpfcnpj: string, rgiEstadual: string, dataNascimento: string, telefone: string,
                celular: string, email: string, enderecoRua: string, enderecoNumero: string, enderecoBairro: string,
                enderecoMunicipioID: string, enderecoCep: string, enderecoComplemento: string, 
                observacao: string, naturezaOperacao: string, usuarioOperacao: string) {           
            this.pessoaID = pessoaID;         
            this.tipoPessoa = tipoPessoa;
            this.subTipoPessoa = subTipoPessoa;
            this.nome = nome;           
            this.nomeFantasia = nomeFantasia;   
            this.cpfcnpj = cpfcnpj;   
            this.rgiEstadual = rgiEstadual;
            this.dataNascimento = dataNascimento;
            this.telefone = telefone;
            this.celular = celular;
            this.email = email;
            this.enderecoRua = enderecoRua;
            this.enderecoNumero = enderecoNumero;
            this.enderecoBairro = enderecoBairro;
            this.enderecoMunicipioID = enderecoMunicipioID;              
            this.enderecoCep = enderecoCep;
            this.enderecoComplemento = enderecoComplemento;
            this.observacao = observacao;
            this.naturezaOperacao = naturezaOperacao;
            this.usuarioOperacao = usuarioOperacao;          
    }
        pessoaID: string;
        tipoPessoa: string;
        subTipoPessoa: string;   
        nome: string;
        nomeFantasia: string;       
        cpfcnpj: string;
        rgiEstadual: string;
        dataNascimento: string;
        telefone: string;
        celular: string;
        email: string;
        enderecoRua: string;
        enderecoNumero: string;
        enderecoBairro: string;
        enderecoMunicipioID: string;       
        enderecoCep: string;
        enderecoComplemento: string;
        observacao: string;
        naturezaOperacao: string;
        usuarioOperacao: string;
}

export class FiltroModalPessoaViewModel {
    tipoPessoa: string = "";
    nome: string = "";
    cPFCNPJ: string = "";
}

export class PessoaFiltroGridViewModel {
    constructor(tipoPessoa: string, nome: string, cPFCNPJ: string,
        offSet: string, pageSize: string,nomeColumn: string, sortDir: string) {
        this.tipoPessoa = tipoPessoa;
        this.nome = nome;
        this.cPFCNPJ = cPFCNPJ;
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    tipoPessoa: string;
    nome: string;
    cPFCNPJ: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridPessoaViewModel {
    result!: any[];
    pessoaID!: string;
    nome!: string;
    nomeFantasia!: string;    
    cpfcnpj!: string;
    telefone!: string;    
    celular!: string;    
    email!: string;
    enderecoDoMunicipio!: string;     
    subTipoPessoa!: string;   
    totalRegistros!: string;
}

export class PessoaRetornoViewModel {
        pessoaID!: string;
        tipoPessoa!: string;
        subTipoPessoa!: string;   
        nome!: string;
        nomeFantasia!: string;       
        cpfcnpj!: string;
        rgiEstadual!: string;
        dataNascimento!: string;
        telefone!: string;
        celular!: string;
        email!: string;
        enderecoRua!: string;
        enderecoNumero!: string;
        enderecoBairro!: string;
        enderecoMunicipioID!: string;
        estadoID!: string;
        enderecoCep!: string;
        enderecoComplemento!: string;
        observacao!: string;
}