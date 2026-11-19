export class DocumentosContratoPostViewModel {
    constructor(documentosContratoID: string,contratoID: string,tipoDocumentoContratoID: string, nomeDocumento: string, arquivo: string,dataDocumento: string,
        dataValidade: string, situacao: string, naturezaOperacao: string, usuarioOperacao: string) {
            this.documentosContratoID = documentosContratoID;
            this.contratoID = contratoID;
            this.tipoDocumentoContratoID = tipoDocumentoContratoID;
            this.nomeDocumento = nomeDocumento;
            this.arquivo = arquivo;
            this.dataDocumento = dataDocumento;
            this.dataValidade = dataValidade;
            this.situacao = situacao;
            this.naturezaOperacao = naturezaOperacao;
            this.usuarioOperacao = usuarioOperacao;
    }
    documentosContratoID: string;
    contratoID: string;
    tipoDocumentoContratoID: string;
    nomeDocumento: string;	
    arquivo: string;    
    dataDocumento: string;
    dataValidade: string;
    situacao: string;
    naturezaOperacao: string;
    usuarioOperacao: string;
}

export class DocumentosContratoRetornoViewModel {   
    documentosContratoID!: string;
    contratoID!: string;
    nomeDocumento!: string;	
    arquivo!: string;    
    dataDocumento!: string;
    dataValidade!: string;
}

export class DocumentosContratoFiltroGridViewModel {
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

export class GridDocumentosContratoViewModel {
    result!: any[];
    documentosContratoID!: string;
    numeroContrato!: string;
    tipoDocumento!: string;	
    dataDocumento!: string;
    dataValidade!: string; 
    totalRegistros!: string;
}

export class DocumentoContrato {
    contratoID: string = '';
    documentoContratoID: string = '';    
}
