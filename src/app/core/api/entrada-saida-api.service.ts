import { Injectable } from '@angular/core';
import { EntradaPostViewModel, EntradaSaidaFiltroGridViewModel, EntradaSaidaRetornoViewModel, GridEntradaSaidaViewModel, SaidaPostViewModel } from 'src/app/core/models/entrada-saida.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root'
})
export class EntradaSaidaApiService extends BaseCrudApiService<EntradaSaidaRetornoViewModel, EntradaSaidaFiltroGridViewModel, GridEntradaSaidaViewModel, any, any> {
  
   
  constructor() {
    super('EntradaSaida');
  }

   public getListEntradaSaida() {
    return this.httpClient.get<SelectDropModel[]>(`${this.apiUrl}/EntradaSaida/SelectFesta/`);
  }

  public postEntradaInserir(dados: EntradaPostViewModel) {
    return this.httpClient.post<EntradaPostViewModel>(`${this.apiUrl}/EntradaSaida/InserirEntrada/`, dados, this.httpOptions);
  }

  public postEntradaAtualiza(dados: EntradaPostViewModel) {
    return this.httpClient.post<EntradaPostViewModel>(`${this.apiUrl}/EntradaSaida/AtualizaEntrada/`, dados, this.httpOptions);
  }

  public postSaidaInserir(dados: SaidaPostViewModel) {
    return this.httpClient.post<SaidaPostViewModel>(`${this.apiUrl}/EntradaSaida/InserirSaida/`, dados, this.httpOptions);
  }

  public postSaidaAtualiza(dados: SaidaPostViewModel) {
    return this.httpClient.post<SaidaPostViewModel>(`${this.apiUrl}/EntradaSaida/AtualizaSaida/`, dados, this.httpOptions);
  }
}
