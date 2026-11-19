import { PedidoCompraAlterarViewModel, PedidoCompraPostViewModel } from 'src/app/core/models/pedidocompra.models';
import { Injectable } from '@angular/core';
import { PedidoCompraFiltroGridViewModel, PedidoCompraRetornoViewModel } from 'src/app/core/models/pedidocompra.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';
import { GridItemPedidoCompraViewModel } from 'src/app/core/models/itempedidocompra.models';

@Injectable({
  providedIn: 'root'
})
export class PedidoCompraApiService extends BaseCrudApiService<PedidoCompraRetornoViewModel, PedidoCompraFiltroGridViewModel, GridItemPedidoCompraViewModel, PedidoCompraPostViewModel, PedidoCompraPostViewModel> {
  
   
  constructor() {
    super('PedidoCompra');
  }

  public postAtualizaPedidoCompra(dados: PedidoCompraAlterarViewModel) {
    return this.httpClient.post<PedidoCompraAlterarViewModel>(`${this.apiUrl}/PedidoCompra/AtualizaPedidoCompra/`, dados, this.httpOptions);
  }
}
