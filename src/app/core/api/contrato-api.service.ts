import { Injectable } from '@angular/core';
import {
  ContratoFiltroGridViewModel,
  ContratoPostViewModel,
  ContratoRetornoViewModel,
  FinalizarContratoViewModel,
  GridContratoViewModel,
} from 'src/app/core/models/contrato.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';

@Injectable({
  providedIn: 'root',
})
export class ContratoApiService extends BaseCrudApiService<ContratoRetornoViewModel, ContratoFiltroGridViewModel, GridContratoViewModel, ContratoPostViewModel, ContratoRetornoViewModel> {

  constructor() {
    super('Contrato');
  }

  public getListContrato() {
    return this.httpClient.get<SelectDropModel[]>(
      `${this.apiUrl}/Contrato/SelectContrato/`
    );
  }

  public getListClienteContrato() {
    return this.httpClient.get<SelectDropModel[]>(
      `${this.apiUrl}/Contrato/SelectClienteContrato/`
    );
  }

  public postFinalizaContrato(dados: FinalizarContratoViewModel) {
    return this.httpClient.post<any>(
      `${this.apiUrl}/Contrato/FinalizarContrato/`,
      dados,
      this.httpOptions
    );
  }
}
