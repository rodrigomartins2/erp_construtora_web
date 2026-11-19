import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuracao } from 'src/app/core/utils/configuracao';

/**
 * Base para os `*-api.service.ts` que seguem a convenção do backend:
 * POST /{recurso}/Grid/, GET /{recurso}/GetID/{id}, GET /{recurso}/Delete/{id}[/{usuario}],
 * POST /{recurso}/Inserir/ e POST /{recurso}/Atualiza/.
 *
 * Endpoints fora desse padrão (selects, relatórios, ações específicas) continuam
 * declarados na própria subclasse, usando `httpClient`, `apiUrl` e `httpOptions`.
 *
 * @typeParam TModel     retorno de GetID
 * @typeParam TFiltro    filtro enviado ao Grid
 * @typeParam TGrid      retorno do Grid
 * @typeParam TPost      payload de Inserir/Atualiza
 * @typeParam TPostRet   retorno de Inserir/Atualiza
 */
export abstract class BaseCrudApiService<TModel = any, TFiltro = any, TGrid = any, TPost = any, TPostRet = any> {
  protected readonly httpClient = inject(HttpClient);
  protected readonly apiUrl = new Configuracao().enderecoApi() + 'api';
  protected readonly httpOptions = {
    headers: new HttpHeaders({
      accept: 'text/plain',
      'Content-Type': 'application/json-patch+json'
    })
  };

  /** URL do recurso, ex.: `https://.../api/Marca`. */
  protected readonly baseUrl: string;

  protected constructor(protected readonly recurso: string) {
    this.baseUrl = `${this.apiUrl}/${recurso}`;
  }

  getConsultarGrid(dados: TFiltro): Observable<TGrid> {
    return this.httpClient.post<TGrid>(`${this.baseUrl}/Grid/`, dados, this.httpOptions);
  }

  getConsultarID(id: string): Observable<TModel> {
    return this.httpClient.get<TModel>(`${this.baseUrl}/GetID/` + id);
  }

  /** Exclui/inativa o registro. Alguns recursos exigem o usuário na rota, outros não. */
  getDeleteID(id: string, usuario?: string): Observable<any> {
    const sufixo = usuario === undefined ? '' : `/${usuario}`;
    return this.httpClient.get<any>(`${this.baseUrl}/Delete/` + id + sufixo);
  }

  postInserir(dados: TPost): Observable<TPostRet> {
    return this.httpClient.post<TPostRet>(`${this.baseUrl}/Inserir/`, dados, this.httpOptions);
  }

  postAtualiza(dados: TPost): Observable<TPostRet> {
    return this.httpClient.post<TPostRet>(`${this.baseUrl}/Atualiza/`, dados, this.httpOptions);
  }
}
