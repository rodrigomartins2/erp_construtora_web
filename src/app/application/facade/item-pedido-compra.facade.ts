import { Injectable, inject } from '@angular/core';

import { ItemPedidoCompraApiService } from 'src/app/core/api/item-pedido-compra-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridItemPedidoCompraViewModel, ItemPedidoCompraFiltroGridViewModel, ItemPedidoCompraPostViewModel, ItemPedidoCompraRetornoViewModel } from 'src/app/core/models/itempedidocompra.models';

/** Facade de item do pedido de compra: ponto de acesso das páginas à API ItemPedidoCompraApiService. */
@Injectable({ providedIn: 'root' })
export class ItemPedidoCompraFacade extends BaseCrudFacade<ItemPedidoCompraRetornoViewModel, ItemPedidoCompraFiltroGridViewModel, GridItemPedidoCompraViewModel, ItemPedidoCompraPostViewModel, ItemPedidoCompraPostViewModel> {
  private readonly api: ItemPedidoCompraApiService;

  constructor() {
    const api = inject(ItemPedidoCompraApiService);
    super(api, 'o item do pedido de compra');
    this.api = api;
  }
}
