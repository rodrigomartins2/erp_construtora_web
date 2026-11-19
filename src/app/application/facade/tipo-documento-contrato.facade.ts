import { Injectable, inject } from '@angular/core';

import { TipoDocumentoContratoApiService } from 'src/app/core/api/tipo-documento-contrato-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridTipoDocumentoContratoViewModel, TipoDocumentoContratoFiltroGridViewModel, TipoDocumentoContratoViewModel } from 'src/app/core/models/tipo-documento-contrato.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de tipo de documento: ponto de acesso das páginas à API TipoDocumentoContratoApiService. */
@Injectable({ providedIn: 'root' })
export class TipoDocumentoContratoFacade extends BaseCrudFacade<TipoDocumentoContratoViewModel, TipoDocumentoContratoFiltroGridViewModel, GridTipoDocumentoContratoViewModel, TipoDocumentoContratoViewModel, TipoDocumentoContratoViewModel> {
  private readonly api: TipoDocumentoContratoApiService;

  constructor() {
    const api = inject(TipoDocumentoContratoApiService);
    super(api, 'o tipo de documento');
    this.api = api;
  }

  getListTipoDocumentoContrato() {
    return this.runWithState(() => this.api.getListTipoDocumentoContrato(), 'Não foi possível carregar o tipo de documento.');
  }
}
