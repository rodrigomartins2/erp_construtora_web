export type ArquivoPreview = {
  previewUrl: string;
  titulo: string;
  origem: string;
};

export type ArquivosListagem = {
  previewUrl: string;
  titulo: string;
  origem: string;
};

export type ArquivoTabelaInterna = ArquivosListagem & { acoes?: unknown };

export type Arquivos = {
  file: File;
  fileType: string;
  name: string;
  origem: string;
  previewUrl?: string;
  titulo?: string;
};
