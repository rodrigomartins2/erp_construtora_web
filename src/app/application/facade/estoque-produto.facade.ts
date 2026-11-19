import { Injectable, inject } from '@angular/core';

import { EstoqueProdutoApiService } from 'src/app/core/api/estoque-produto-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { GridProdutoDescricaoViewModel } from 'src/app/core/models/produto-descricao.models';
import { EstoqueProdutoFiltroGridViewModel, EstoqueProdutoRetornoViewModel, EstoqueProdutoViewModel } from 'src/app/core/models/estoque-produto.models';

/** Facade de estoque do produto: ponto de acesso das páginas à API EstoqueProdutoApiService. */
@Injectable({ providedIn: 'root' })
export class EstoqueProdutoFacade extends BaseCrudFacade<EstoqueProdutoRetornoViewModel, EstoqueProdutoFiltroGridViewModel, GridProdutoDescricaoViewModel, EstoqueProdutoViewModel, EstoqueProdutoViewModel> {
  private readonly api: EstoqueProdutoApiService;

  constructor() {
    const api = inject(EstoqueProdutoApiService);
    super(api, 'o estoque do produto');
    this.api = api;
  }

  getListSelectEstoqueProdutoItens(entradaSaidaID: number) {
    return this.runWithState(() => this.api.getListSelectEstoqueProdutoItens(entradaSaidaID), 'Não foi possível carregar o estoque do produto.');
  }

  getListEstoqueProdutoItens() {
    return this.runWithState(() => this.api.getListEstoqueProdutoItens(), 'Não foi possível carregar o estoque do produto.');
  }
}
