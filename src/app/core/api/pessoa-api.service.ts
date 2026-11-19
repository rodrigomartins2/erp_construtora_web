import { Injectable } from '@angular/core';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { GridPessoaViewModel, PessoaFiltroGridViewModel, PessoaRetornoViewModel, PessoaViewModel } from 'src/app/core/models/pessoa.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';

@Injectable({
  providedIn: 'root'
})
export class PessoaApiService extends BaseCrudApiService<PessoaRetornoViewModel, PessoaFiltroGridViewModel, GridPessoaViewModel, PessoaViewModel, PessoaViewModel> {
  
   
  constructor() {
    super('Pessoa');
  }

   public getListPessoa(tipo: string) {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/Pessoa/SelectPessoa/` + tipo);
  }

}
