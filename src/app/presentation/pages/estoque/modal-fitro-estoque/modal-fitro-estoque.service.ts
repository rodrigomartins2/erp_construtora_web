import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalEstoqueProdutoViewModel } from 'src/app/core/models/estoque-produto.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroEstoqueService {

  constructor() { } 

  private subject = new Subject<FiltroModalEstoqueProdutoViewModel>();

  asObservable(): Observable<FiltroModalEstoqueProdutoViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalEstoqueProdutoViewModel) {
    this.subject.next(filtro); 
  }
}
