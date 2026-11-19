import { TipoColuna } from "src/app/presentation/components/table/enums/tipo-coluna.enum";
import { TipoPipe } from "src/app/presentation/components/table/enums/tipo-pipe.enum";

export type Coluna = {
    nome: string;
    titulo: string;
    tipo: TipoColuna;
    pipe: TipoPipe;
};