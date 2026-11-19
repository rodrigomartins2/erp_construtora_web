import { Injectable, inject } from '@angular/core';

import { CategoriaApiService } from 'src/app/core/api/categoria-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { CategoriaFiltroGridViewModel, CategoriaRetornoViewModel, CategoriaViewModel, GridCategoriaViewModel } from 'src/app/core/models/categoria.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de categoria: ponto de acesso das páginas à API CategoriaApiService. */
@Injectable({ providedIn: 'root' })
export class CategoriaFacade extends BaseCrudFacade<CategoriaRetornoViewModel, CategoriaFiltroGridViewModel, GridCategoriaViewModel, CategoriaViewModel, CategoriaViewModel> {
  private readonly api: CategoriaApiService;

  constructor() {
    const api = inject(CategoriaApiService);
    super(api, 'a categoria');
    this.api = api;
  }

  getListCategoria() {
    return this.runWithState(() => this.api.getListCategoria(), 'Não foi possível carregar a categoria.');
  }
}
