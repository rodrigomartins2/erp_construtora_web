export class ObraPostViewModel {
    constructor(obraID: string,contratoID: string,nomeDaObra: string,pessoaResponsavelID: string,situacao: string,
dataInicioObra: string,dataFimObra: string,observacao: string, naturezaOperacao: string, usuarioOperacao: string) {
            this.obraID = obraID;
            this.contratoID = contratoID;
            this.nomeDaObra = nomeDaObra;
            this.pessoaResponsavelID = pessoaResponsavelID;
            this.situacao = situacao;
            this.dataInicioObra = dataInicioObra;
            this.dataFimObra = dataFimObra;
            this.observacao = observacao;
            this.naturezaOperacao = naturezaOperacao;
            this.usuarioOperacao = usuarioOperacao;
    }
    obraID: string;
    contratoID: string;
    nomeDaObra: string;
    pessoaResponsavelID: string;	
    situacao: string;    
    dataInicioObra: string;
    dataFimObra: string;
    observacao: string;
    naturezaOperacao: string;
    usuarioOperacao: string;
}

export class ObraRetornoViewModel {   
    obraID!: string;
    contratoID!: string;
    nomeDaObra!: string;
    pessoaResponsavelID!: string;	
    nomeResponsavel!: string;    
    dataInicioObra!: string;
    dataFimObra!: string;
    observacao!: string;
}

export class ObraFiltroGridViewModel {
    constructor(contratoID: string, offSet: string, pageSize: string,nomeColumn: string, sortDir: string) {
        this.contratoID = contratoID;    
        this.offSet = offSet;
        this.pageSize = pageSize;
        this.nomeColumn = nomeColumn;
        this.sortDir = sortDir;
    }
    contratoID: string;
    offSet: string;
    pageSize: string;
    nomeColumn: string;
    sortDir: string;
}

export class GridObraViewModel {
    result!: any[];
    obraID!: string;
    numeroContrato!: string;
    nomeDaObra!: string;	
    nomeResponsavel!: string;
    dataInicioObra!: string;
    dataFimObra!: string; 
    situacao!: string;
    totalRegistros!: string;
}
