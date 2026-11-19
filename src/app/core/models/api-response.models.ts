/** Envelope de resposta padrão (usado pelos componentes genéricos de tabela). */
export interface ApiResponse<TDados> {
  sucesso: boolean;
  mensagem: string;
  dados: TDados | null;
  erros: string[];
  statusCode: number;
  dataHoraRetorno: string;
}

export type ListagemGeneric<T> = {
  result: T[];
  total: number;
};

export interface MensagemViewModel {
  executouServico: boolean;
  datatHoraRetorno: string;
  mensagemFalha: string;
  mensagemSucesso: string;
  codigo: number | null;
  statusCode: number | null;
  mensagem?: string;
}

export interface SelectDropViewModel {
  codigo: string;
  descricao: string;
}
