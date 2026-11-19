import { Observable } from 'rxjs';
import { Coluna } from 'src/app/presentation/components/table/models/coluna.model';
import { Acao } from 'src/app/presentation/components/table/models/acao.model';

export type Tabela<T> = {
    colunas: Coluna[];
    acoes: Acao<T>[];
    dados: Observable<T[]>;
};
