import { Injectable, inject } from '@angular/core';

import { FormaPagamentoApiService } from 'src/app/core/api/forma-pagamento-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { FormaPagamentoFiltroGridViewModel, FormaPagamentoViewModel, GridFormaPagamentoViewModel } from 'src/app/core/models/formapagamento.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de forma de pagamento: ponto de acesso das páginas à API FormaPagamentoApiService. */
@Injectable({ providedIn: 'root' })
export class FormaPagamentoFacade extends BaseCrudFacade<FormaPagamentoViewModel, FormaPagamentoFiltroGridViewModel, GridFormaPagamentoViewModel, FormaPagamentoViewModel, FormaPagamentoViewModel> {
  private readonly api: FormaPagamentoApiService;

  constructor() {
    const api = inject(FormaPagamentoApiService);
    super(api, 'a forma de pagamento');
    this.api = api;
  }

  getListFormaPagamento() {
    return this.runWithState(() => this.api.getListFormaPagamento(), 'Não foi possível carregar a forma de pagamento.');
  }
}
