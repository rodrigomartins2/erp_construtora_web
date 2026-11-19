export class LoginSModel {
    email!: string;
    senha!: string;
}

export class LoginDadosModel {

    constructor(usuarioID: string, nome: string, login: string, senha: string, senhaPadrao: string, 
                mensagem: string, validadeSenha: string, funcao: string) {

        this.usuarioID = usuarioID;       
        this.nome = nome;
        this.login = login;
        this.senha = senha;
        this.senhaPadrao = senhaPadrao;
        this.validadeSenha = validadeSenha;    
        this.mensagem = mensagem;
        this.funcao = funcao;
    }

    usuarioID: string;
    nome: string;
    login: string;
    senha: string;
    senhaPadrao: string;
    validadeSenha: string;
    mensagem: string;
    funcao: string;
    
}

export class AlterarSenhaViewModel {

    constructor(usuarioID: string, senha: string) {

        this.usuarioID = usuarioID;        
        this.senha = senha;
    }

    usuarioID: string;
    senha: string;
}

export class MenusViewModel {

    constructor(menuID: string, descricao: string, imagemUrl: string, subMenus: SubMenusViewModel[]) {
        this.menuID = menuID;        
        this.descricao = descricao;
        this.imagemUrl = imagemUrl;
        this.subMenus = subMenus;
    }

    menuID: string;
    descricao: string;
    imagemUrl: string;
    subMenus: SubMenusViewModel[];
}

export class SubMenusViewModel {

    constructor(subMenuID: string, descricao: string, componentes: ComponentesViewModel[]) {

        this.subMenuID = subMenuID;        
        this.descricao = descricao;
        this.componentes = componentes;
    }

    subMenuID: string;
    descricao: string;
    componentes: ComponentesViewModel[];
}

export class ComponentesViewModel {

    constructor(componenteID: string, descricao: string, identificador: string) {
        this.componenteID = componenteID;        
        this.descricao = descricao;
        this.identificador = identificador;
    }

    componenteID: string;
    descricao: string;
    identificador: string;
}