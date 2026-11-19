import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalProdutoViewModel } from 'src/app/core/models/produto.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroProdutoService {

  constructor() { } 

  private subject = new Subject<FiltroModalProdutoViewModel>();

  asObservable(): Observable<FiltroModalProdutoViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalProdutoViewModel) {
    this.subject.next(filtro); 
  }
}
