import { Injectable, inject } from '@angular/core';

import { PedidoCompraApiService } from 'src/app/core/api/pedido-compra-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { PedidoCompraAlterarViewModel, PedidoCompraPostViewModel } from 'src/app/core/models/pedidocompra.models';
import { PedidoCompraFiltroGridViewModel, PedidoCompraRetornoViewModel } from 'src/app/core/models/pedidocompra.models';
import { GridItemPedidoCompraViewModel } from 'src/app/core/models/itempedidocompra.models';

/** Facade de pedido de compra: ponto de acesso das páginas à API PedidoCompraApiService. */
@Injectable({ providedIn: 'root' })
export class PedidoCompraFacade extends BaseCrudFacade<PedidoCompraRetornoViewModel, PedidoCompraFiltroGridViewModel, GridItemPedidoCompraViewModel, PedidoCompraPostViewModel, PedidoCompraPostViewModel> {
  private readonly api: PedidoCompraApiService;

  constructor() {
    const api = inject(PedidoCompraApiService);
    super(api, 'o pedido de compra');
    this.api = api;
  }

  postAtualizaPedidoCompra(dados: PedidoCompraAlterarViewModel) {
    return this.runWithState(() => this.api.postAtualizaPedidoCompra(dados), 'Não foi possível salvar o pedido de compra.');
  }
}
