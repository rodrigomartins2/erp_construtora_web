export interface SelectDropModel {
    codigo: string;
    descricao: string;
}

export class MensagemPushViewModel {
    mensagemPushID!: string;
    pessoaID!: string;
    titulo!: string;
    mensagem!: string;
    data!: string;
    hora!: string;
    usuarioID!: string;
    nomeEnvio!: string;
    dataLeitura!: string;
}

export class Imagens {    
    nome!: string;
    caminho!: string;  
    type!: string;  
}

export class ListaDataMensagemPushViewModel {
    data!: string;
    mensagens!: DadosMensagemPushViewModel[];
}

export class DadosMensagemPushViewModel {
    mensagemPushID!: string;
    titulo!: string;
    mensagem!: string;
    hora!: string;
    nomeEnvio!: string;
    dataLeitura!: string;
}

export class MensagemPushPostViewModel {
    constructor(mensagemPushID: string, dataLeitura: string) {
        this.mensagemPushID = mensagemPushID;
        this.dataLeitura = dataLeitura;
    }

    mensagemPushID: string;
    dataLeitura: string;
}


export class RouteStack {
    route: string = '';
    caller: string = '';
    params: any[] = [];
  }