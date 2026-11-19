import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { CategoriaPrincipalFiltroGridViewModel, CategoriaPrincipalViewModel, GridCategoriaPrincipalViewModel } from 'src/app/core/models/categoria-principal.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaPrincipalApiService extends BaseCrudApiService<CategoriaPrincipalViewModel, CategoriaPrincipalFiltroGridViewModel, GridCategoriaPrincipalViewModel, CategoriaPrincipalViewModel, CategoriaPrincipalViewModel> {
  
   
  constructor() {
    super('CategoriaPrincipal');
  }

   public getListCategoria() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/CategoriaPrincipal/SelectCategoriaPrincipal/`);
  }

}
