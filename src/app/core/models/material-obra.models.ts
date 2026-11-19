export class MaterialObraViewModel {
    constructor(materialObraID: string,  obraID: string, produtoDescricaoID: string, quantidade: string,
        usuarioOperacao: string, naturezaOperacao: string) {
        this.materialObraID = materialObraID;      
        this.obraID = obraID;  
        this.produtoDescricaoID = produtoDescricaoID;
        this.quantidade = quantidade,
        this.usuarioOperacao = usuarioOperacao;      
        this.naturezaOperacao = naturezaOperacao;
    }

    materialObraID: string;
    obraID: string;
    produtoDescricaoID: string;
    quantidade: string;
    usuarioOperacao: string;
    naturezaOperacao: string;
}

export class MaterialObraFiltroGridViewModel {
    constructor(obraID: string,offSet: string, pageSize: string,
        nomeColumn: string, sortDir: string) {
        this.obraID = obraID;
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    
    obraID: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridMaterialObraViewModel {
    result!: any[];
    materialObraID!: string;
    produto!: string;
    quantidade!: string;
    saldoEstoque!: string;    
    totalRegistros!: string;
}

