import { Injectable, inject } from '@angular/core';

import { ProdutoDescricaoApiService } from 'src/app/core/api/produto-descricao-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridProdutoDescricaoViewModel, ProdutoDescricaoFiltroGridViewModel, ProdutoDescricaoRetornoViewModel, ProdutoDescricaoViewModel } from 'src/app/core/models/produto-descricao.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de produto: ponto de acesso das páginas à API ProdutoDescricaoApiService. */
@Injectable({ providedIn: 'root' })
export class ProdutoDescricaoFacade extends BaseCrudFacade<ProdutoDescricaoRetornoViewModel, ProdutoDescricaoFiltroGridViewModel, GridProdutoDescricaoViewModel, ProdutoDescricaoViewModel, ProdutoDescricaoViewModel> {
  private readonly api: ProdutoDescricaoApiService;

  constructor() {
    const api = inject(ProdutoDescricaoApiService);
    super(api, 'o produto');
    this.api = api;
  }

  getListProdutoDescricao() {
    return this.runWithState(() => this.api.getListProdutoDescricao(), 'Não foi possível carregar o produto.');
  }

  getListProdutoDescricaoComSaldo() {
    return this.runWithState(() => this.api.getListProdutoDescricaoComSaldo(), 'Não foi possível carregar o produto.');
  }

  getListProdutoDescricaoItensObra(obraID: any) {
    return this.runWithState(() => this.api.getListProdutoDescricaoItensObra(obraID), 'Não foi possível carregar o produto.');
  }

  getListSelectProdutoDescricaoItens(entradaSaidaID: number) {
    return this.runWithState(() => this.api.getListSelectProdutoDescricaoItens(entradaSaidaID), 'Não foi possível carregar o produto.');
  }

  getListSSelectProdutoDescricaoSemEstoque(estoqueID: string) {
    return this.runWithState(() => this.api.getListSSelectProdutoDescricaoSemEstoque(estoqueID), 'Não foi possível carregar o produto.');
  }

  getListSelectProdutoDescricaoItensPedidoCompra(pedidoCompraID: number) {
    return this.runWithState(() => this.api.getListSelectProdutoDescricaoItensPedidoCompra(pedidoCompraID), 'Não foi possível carregar o produto.');
  }
}
