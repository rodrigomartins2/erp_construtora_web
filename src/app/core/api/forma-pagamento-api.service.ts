import { Injectable } from '@angular/core';
import { FormaPagamentoFiltroGridViewModel, FormaPagamentoViewModel, GridFormaPagamentoViewModel } from 'src/app/core/models/formapagamento.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoApiService extends BaseCrudApiService<FormaPagamentoViewModel, FormaPagamentoFiltroGridViewModel, GridFormaPagamentoViewModel, FormaPagamentoViewModel, FormaPagamentoViewModel> {
  
   
  constructor() {
    super('FormaPagamento');
  }

   public getListFormaPagamento() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/FormaPagamento/SelectFormaPagamento/`);
  }

}
