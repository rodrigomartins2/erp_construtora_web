import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalPedidoCompraViewModel } from 'src/app/core/models/pedidocompra.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroPedidocompraService {

  constructor() { } 

  private subject = new Subject<FiltroModalPedidoCompraViewModel>();

  asObservable(): Observable<FiltroModalPedidoCompraViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalPedidoCompraViewModel) {
    this.subject.next(filtro); 
  }
}
