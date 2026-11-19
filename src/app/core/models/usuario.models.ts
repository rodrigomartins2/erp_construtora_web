export class UsuarioViewModel {
    constructor(usuarioID: string, pessoaID: string, funcaoID: string, nome: string, login: string,
        senha: string, senhaPadrao: string, situacao: string ) {
            this.usuarioID = usuarioID;
            this.pessoaID = pessoaID;
            this.funcaoID = funcaoID;
            this.nome = nome;
            this.login = login;
            this.senha = senha;
            this.senhaPadrao = senhaPadrao;
            this.situacao = situacao;
    }

    usuarioID: string; 
    pessoaID: string; 
    funcaoID: string; 
    nome: string; 
    login: string; 
    senha: string; 
    senhaPadrao: string; 
    situacao: string; 
}

export class FiltroModalUsuarioViewModel {    
    funcaoID: string = "";
    nome: string = "";
    situacao: string = "";
}

export class UsuarioFiltroGridViewModel {
    constructor(funcaoID: string, nome: string, situacao: string,offSet: string, pageSize: string,
        nomeColumn: string, sortDir: string) {
        this.funcaoID = funcaoID;
        this.nome = nome;
        this.situacao = situacao;
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    
    funcaoID: string;
    nome: string;
    situacao: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridUsuarioViewModel {
    result!: any[];
    usuarioID!: string;
    funcaoDescricao!: string;
    nome!: string;   
    login!: string;
    senhaPadrao!: string;
    situacao!: string;
    totalRegistros!: string;
}