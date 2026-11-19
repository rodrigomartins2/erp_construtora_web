import { Injectable } from '@angular/core';
import { CategoriaFiltroGridViewModel, CategoriaRetornoViewModel, CategoriaViewModel, GridCategoriaViewModel } from 'src/app/core/models/categoria.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaApiService extends BaseCrudApiService<CategoriaRetornoViewModel, CategoriaFiltroGridViewModel, GridCategoriaViewModel, CategoriaViewModel, CategoriaViewModel> {
  
   
  constructor() {
    super('Categoria');
  }
 

   public getListCategoria() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/Categoria/SelectCategoria/`);
  }

}
