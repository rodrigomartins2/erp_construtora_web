import { Injectable, inject } from '@angular/core';

import { TipoMovimentoApiService } from 'src/app/core/api/tipo-movimento-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridTipoMovimentoViewModel, TipoMovimentoFiltroGridViewModel, TipoMovimentoViewModel } from 'src/app/core/models/tipo-movimento.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de tipo de movimento: ponto de acesso das páginas à API TipoMovimentoApiService. */
@Injectable({ providedIn: 'root' })
export class TipoMovimentoFacade extends BaseCrudFacade<TipoMovimentoViewModel, TipoMovimentoFiltroGridViewModel, GridTipoMovimentoViewModel, TipoMovimentoViewModel, TipoMovimentoViewModel> {
  private readonly api: TipoMovimentoApiService;

  constructor() {
    const api = inject(TipoMovimentoApiService);
    super(api, 'o tipo de movimento');
    this.api = api;
  }

  getListTipoMovimento(operacao: string) {
    return this.runWithState(() => this.api.getListTipoMovimento(operacao), 'Não foi possível carregar o tipo de movimento.');
  }
}
