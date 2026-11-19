import { Observable } from 'rxjs';

import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { BaseFacade } from 'src/app/application/shared/base.facade';

/**
 * Base para facades de CRUD. Expõe as operações padrão do backend
 * (Grid, GetID, Delete, Inserir, Atualiza) com controle de `loading`/erro.
 *
 * `entityLabel` é o trecho com artigo usado nas mensagens, ex.: "a marca",
 * "o tipo de movimento", no padrão "Não foi possível <verbo> <entityLabel>.".
 */
export abstract class BaseCrudFacade<TModel = any, TFiltro = any, TGrid = any, TPost = any, TPostRet = any> extends BaseFacade {
  protected constructor(
    protected readonly apiService: BaseCrudApiService<TModel, TFiltro, TGrid, TPost, TPostRet>,
    protected readonly entityLabel: string
  ) {
    super();
  }

  getConsultarGrid(dados: TFiltro): Observable<TGrid> {
    return this.runWithState(() => this.apiService.getConsultarGrid(dados), `Não foi possível consultar ${this.entityLabel}.`);
  }

  getConsultarID(id: string): Observable<TModel> {
    return this.runWithState(() => this.apiService.getConsultarID(id), `Não foi possível carregar ${this.entityLabel}.`);
  }

  getDeleteID(id: string, usuario?: string): Observable<any> {
    return this.runWithState(() => this.apiService.getDeleteID(id, usuario), `Não foi possível excluir ${this.entityLabel}.`);
  }

  postInserir(dados: TPost): Observable<TPostRet> {
    return this.runWithState(() => this.apiService.postInserir(dados), `Não foi possível incluir ${this.entityLabel}.`);
  }

  postAtualiza(dados: TPost): Observable<TPostRet> {
    return this.runWithState(() => this.apiService.postAtualiza(dados), `Não foi possível atualizar ${this.entityLabel}.`);
  }
}
