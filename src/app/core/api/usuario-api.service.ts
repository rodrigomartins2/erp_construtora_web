import { Injectable } from '@angular/core';
import { GridUsuarioViewModel, UsuarioFiltroGridViewModel, UsuarioViewModel } from 'src/app/core/models/usuario.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService extends BaseCrudApiService<UsuarioViewModel, UsuarioFiltroGridViewModel, GridUsuarioViewModel, UsuarioViewModel, UsuarioViewModel> {
  
   
  constructor() {
    super('Usuario');
  }

   public getListUsuario() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/Usuario/SelectUsuario/`);
  }

}
