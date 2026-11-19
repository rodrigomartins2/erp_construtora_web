import { Injectable } from '@angular/core';
import { GridItensEntradaSaidaViewModel, ItensEntradaPostViewModel, ItensEntradaSaidaFiltroGridViewModel, ItensSaidaPostViewModel, MovimentarEstoqueViewModel } from 'src/app/core/models/itens-entrada-saida.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';

@Injectable({
  providedIn: 'root'
})
export class ItensEntradaSaidaApiService extends BaseCrudApiService<any, ItensEntradaSaidaFiltroGridViewModel, GridItensEntradaSaidaViewModel, ItensEntradaPostViewModel, ItensEntradaPostViewModel> {
  
   
  constructor() {
    super('ItensEntradaSaida');
  }

  public postInserirSaidas(dados: ItensSaidaPostViewModel) {
    return this.httpClient.post<ItensSaidaPostViewModel>(`${this.apiUrl}/ItensEntradaSaida/InserirSaidas/`, dados, this.httpOptions);
  }

  public postAtualizaEstoque(dados: MovimentarEstoqueViewModel) {
    return this.httpClient.post<any>(`${this.apiUrl}/ItensEntradaSaida/MovimentarEstoque/`, dados, this.httpOptions);
  }
}
