import { Injectable, inject } from '@angular/core';

import { MarcaApiService } from 'src/app/core/api/marca-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridMarcaViewModel, MarcaFiltroGridViewModel, MarcaViewModel } from 'src/app/core/models/marca.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de marca: ponto de acesso das páginas à API MarcaApiService. */
@Injectable({ providedIn: 'root' })
export class MarcaFacade extends BaseCrudFacade<MarcaViewModel, MarcaFiltroGridViewModel, GridMarcaViewModel, MarcaViewModel, MarcaViewModel> {
  private readonly api: MarcaApiService;

  constructor() {
    const api = inject(MarcaApiService);
    super(api, 'a marca');
    this.api = api;
  }

  getListMarca() {
    return this.runWithState(() => this.api.getListMarca(), 'Não foi possível carregar a marca.');
  }
}
