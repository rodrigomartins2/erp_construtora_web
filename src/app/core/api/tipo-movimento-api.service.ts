import { Injectable } from '@angular/core';
import { GridTipoMovimentoViewModel, TipoMovimentoFiltroGridViewModel, TipoMovimentoViewModel } from 'src/app/core/models/tipo-movimento.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class TipoMovimentoApiService extends BaseCrudApiService<TipoMovimentoViewModel, TipoMovimentoFiltroGridViewModel, GridTipoMovimentoViewModel, TipoMovimentoViewModel, TipoMovimentoViewModel> {
  
   
  constructor() {
    super('TipoMovimento');
  }

   public getListTipoMovimento(operacao: string) {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/TipoMovimento/SelectTipoMovimento/` + operacao);
  }

}
