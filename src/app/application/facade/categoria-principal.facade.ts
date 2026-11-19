import { Injectable, inject } from '@angular/core';

import { CategoriaPrincipalApiService } from 'src/app/core/api/categoria-principal-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { CategoriaPrincipalFiltroGridViewModel, CategoriaPrincipalViewModel, GridCategoriaPrincipalViewModel } from 'src/app/core/models/categoria-principal.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de categoria principal: ponto de acesso das páginas à API CategoriaPrincipalApiService. */
@Injectable({ providedIn: 'root' })
export class CategoriaPrincipalFacade extends BaseCrudFacade<CategoriaPrincipalViewModel, CategoriaPrincipalFiltroGridViewModel, GridCategoriaPrincipalViewModel, CategoriaPrincipalViewModel, CategoriaPrincipalViewModel> {
  private readonly api: CategoriaPrincipalApiService;

  constructor() {
    const api = inject(CategoriaPrincipalApiService);
    super(api, 'a categoria principal');
    this.api = api;
  }

  getListCategoria() {
    return this.runWithState(() => this.api.getListCategoria(), 'Não foi possível carregar a categoria principal.');
  }
}
