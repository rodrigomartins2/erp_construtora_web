import { Injectable } from '@angular/core';
import { GridMarcaViewModel, MarcaFiltroGridViewModel, MarcaViewModel } from 'src/app/core/models/marca.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class MarcaApiService extends BaseCrudApiService<MarcaViewModel, MarcaFiltroGridViewModel, GridMarcaViewModel, MarcaViewModel, MarcaViewModel> {
  
   
  constructor() {
    super('Marca');
  }

   public getListMarca() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/Marca/SelectMarca/`);
  }

}
