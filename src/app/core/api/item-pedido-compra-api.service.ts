import { Injectable } from '@angular/core';
import { GridItemPedidoCompraViewModel, ItemPedidoCompraFiltroGridViewModel, ItemPedidoCompraPostViewModel, ItemPedidoCompraRetornoViewModel } from 'src/app/core/models/itempedidocompra.models';
import { Observable } from 'rxjs';
import { BaseCrudApiService } from 'src/app/core/api/base-crud-api.service';

@Injectable({
  providedIn: 'root'
})
export class ItemPedidoCompraApiService extends BaseCrudApiService<ItemPedidoCompraRetornoViewModel, ItemPedidoCompraFiltroGridViewModel, GridItemPedidoCompraViewModel, ItemPedidoCompraPostViewModel, ItemPedidoCompraPostViewModel> {
  
   
  constructor() {
    super('ItemPedidoCompra');
  }
 

}
