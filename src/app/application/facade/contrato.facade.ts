import { Injectable, inject } from '@angular/core';

import { ContratoApiService } from 'src/app/core/api/contrato-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import {
  ContratoFiltroGridViewModel,
  ContratoPostViewModel,
  ContratoRetornoViewModel,
  FinalizarContratoViewModel,
  GridContratoViewModel,
} from 'src/app/core/models/contrato.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de contrato: ponto de acesso das páginas à API ContratoApiService. */
@Injectable({ providedIn: 'root' })
export class ContratoFacade extends BaseCrudFacade<ContratoRetornoViewModel, ContratoFiltroGridViewModel, GridContratoViewModel, ContratoPostViewModel, ContratoRetornoViewModel> {
  private readonly api: ContratoApiService;

  constructor() {
    const api = inject(ContratoApiService);
    super(api, 'o contrato');
    this.api = api;
  }

  getListContrato() {
    return this.runWithState(() => this.api.getListContrato(), 'Não foi possível carregar o contrato.');
  }

  getListClienteContrato() {
    return this.runWithState(() => this.api.getListClienteContrato(), 'Não foi possível carregar o contrato.');
  }

  postFinalizaContrato(dados: FinalizarContratoViewModel) {
    return this.runWithState(() => this.api.postFinalizaContrato(dados), 'Não foi possível salvar o contrato.');
  }
}
