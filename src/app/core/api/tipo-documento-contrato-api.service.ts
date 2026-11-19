import { Injectable } from '@angular/core';
import { GridTipoDocumentoContratoViewModel, TipoDocumentoContratoFiltroGridViewModel, TipoDocumentoContratoViewModel } from 'src/app/core/models/tipo-documento-contrato.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoContratoApiService extends BaseCrudApiService<TipoDocumentoContratoViewModel, TipoDocumentoContratoFiltroGridViewModel, GridTipoDocumentoContratoViewModel, TipoDocumentoContratoViewModel, TipoDocumentoContratoViewModel> {
  
   
  constructor() {
    super('TipoDocumentoContrato');
  }

   public getListTipoDocumentoContrato() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/TipoDocumentoContrato/SelectTipoDocumentoContrato/`);
  }

}
