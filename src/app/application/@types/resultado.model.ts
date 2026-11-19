export type Resultado<T> = {
  sucesso: boolean;
  dados?: T;
  erro?: string;
  falhaDisparada?: string;
  loading: boolean;
  mensagens?: { severity: string; summary?: string; detail: string }[];
};
