import { Injectable, inject } from '@angular/core';

import { ProdutoApiService } from 'src/app/core/api/produto-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridProdutoViewModel, ProdutoFiltroGridViewModel, ProdutoViewModel } from 'src/app/core/models/produto.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de produto: ponto de acesso das páginas à API ProdutoApiService. */
@Injectable({ providedIn: 'root' })
export class ProdutoFacade extends BaseCrudFacade<ProdutoViewModel, ProdutoFiltroGridViewModel, GridProdutoViewModel, ProdutoViewModel, ProdutoViewModel> {
  private readonly api: ProdutoApiService;

  constructor() {
    const api = inject(ProdutoApiService);
    super(api, 'o produto');
    this.api = api;
  }

  getListProduto() {
    return this.runWithState(() => this.api.getListProduto(), 'Não foi possível carregar o produto.');
  }
}
