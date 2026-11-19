import { Injectable } from '@angular/core';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { DocumentosContratoFiltroGridViewModel, DocumentosContratoPostViewModel, DocumentosContratoRetornoViewModel, GridDocumentosContratoViewModel } from 'src/app/core/models/documentocontrato.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentosContratoApiService extends BaseCrudApiService<DocumentosContratoRetornoViewModel, DocumentosContratoFiltroGridViewModel, GridDocumentosContratoViewModel, DocumentosContratoPostViewModel, DocumentosContratoRetornoViewModel> {
  
   
  constructor() {
    super('DocumentosContrato');
  }

   public getListDocumentosContrato() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/DocumentosContrato/SelectDocumentosContrato/`);
  }

 
}
