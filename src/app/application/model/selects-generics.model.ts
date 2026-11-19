export type SelectGeneric = {
  codigo: string | number;
  descricao: string;
};

export type SelectGenericBoolean = {
  codigo: boolean;
  descricao: string;
};

export type SelectGenericWithUF = SelectGeneric & {
  uf: string;
};

export type SelectGenericUF = {
  codUF: string;
  descUF: string;
  descricao: string;
};

export type SelectGenericWithFilialPadrao = SelectGeneric & {
  filialPadrao: string;
};
