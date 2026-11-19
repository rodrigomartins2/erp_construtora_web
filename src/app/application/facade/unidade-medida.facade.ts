import { Injectable, inject } from '@angular/core';

import { UnidadeMedidaApiService } from 'src/app/core/api/unidade-medida-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridUnidadesMedidaViewModel, UnidadesMedidaFiltroGridViewModel, UnidadesMedidaViewModel } from 'src/app/core/models/unidade-medida.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de unidade de medida: ponto de acesso das páginas à API UnidadeMedidaApiService. */
@Injectable({ providedIn: 'root' })
export class UnidadeMedidaFacade extends BaseCrudFacade<UnidadesMedidaViewModel, UnidadesMedidaFiltroGridViewModel, GridUnidadesMedidaViewModel, UnidadesMedidaViewModel, UnidadesMedidaViewModel> {
  private readonly api: UnidadeMedidaApiService;

  constructor() {
    const api = inject(UnidadeMedidaApiService);
    super(api, 'a unidade de medida');
    this.api = api;
  }

  getListUnidadeMedida() {
    return this.runWithState(() => this.api.getListUnidadeMedida(), 'Não foi possível carregar a unidade de medida.');
  }
}
