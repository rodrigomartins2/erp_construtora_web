import { Injectable } from '@angular/core';
import { EstoquePessoaFiltroGridViewModel, EstoquePessoaPostViewModel, EstoquePessoaRetornoViewModel, GridEstoquePessoaViewModel } from 'src/app/core/models/estoquepessoa.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { EntradaPostViewModel } from 'src/app/core/models/entrada-saida.models';

@Injectable({
  providedIn: 'root'
})
export class EstoquePessoaApiService extends BaseCrudApiService<EstoquePessoaRetornoViewModel, EstoquePessoaFiltroGridViewModel, GridEstoquePessoaViewModel, any, any> {
  
   
  constructor() {
    super('EstoquePessoa');
  }

   public getListEstoquePessoa() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/EstoquePessoa/SelectEstoquePessoa/`);
  }

  public postEntradaInserir(dados: EstoquePessoaPostViewModel) {
    return this.httpClient.post<EstoquePessoaPostViewModel>(`${this.apiUrl}/EstoquePessoa/Inserir/`, dados, this.httpOptions);
  }

  public postEntradaAtualiza(dados: EstoquePessoaPostViewModel) {
    return this.httpClient.post<EstoquePessoaPostViewModel>(`${this.apiUrl}/EstoquePessoa/Atualiza/`, dados, this.httpOptions);
  }

 
}
