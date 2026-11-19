export class  MenuViewModel {
    constructor(menuID: string, descricao: string, ordem: string, icone: string, imagemUrl: string) {

        this.menuID = menuID;
        this.descricao = descricao;
        this.ordem = ordem;
        this.icone = icone;
        this.imagemUrl = imagemUrl;
    }

    menuID: string;
    descricao: string;
    ordem: string;
    icone: string;
    imagemUrl: string;
}

export class MenuDadosViewModel {    
    menuID: string = '';
    descricao: string = '';
    ordem: string = '';
    icone: string = '';
    imagemUrl: string = '';
}

export class MenuFiltroGridViewModel {
    constructor(descricao: string, offSet: string, pageSize: string, nomeColumn: string, sortDir: string) {
        this.descricao = descricao;
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }

    descricao: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridMenuViewModel {
    result!: any[];
    menuID!: number;   
    descricao!: string;
    Ordem!: string;
    icone!: string;
    totalRegistros!: string;
}