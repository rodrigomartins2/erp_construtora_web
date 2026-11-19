import { Injectable } from '@angular/core';
import { GridUnidadesMedidaViewModel, UnidadesMedidaFiltroGridViewModel, UnidadesMedidaViewModel } from 'src/app/core/models/unidade-medida.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class UnidadeMedidaApiService extends BaseCrudApiService<UnidadesMedidaViewModel, UnidadesMedidaFiltroGridViewModel, GridUnidadesMedidaViewModel, UnidadesMedidaViewModel, UnidadesMedidaViewModel> {
  
   
  constructor() {
    super('UnidadesMedida');
  }

   public getListUnidadeMedida() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/UnidadesMedida/SelectUnidadesMedida/`);
  }

}
