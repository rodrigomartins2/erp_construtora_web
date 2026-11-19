import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalProdutoDescricaoViewModel } from 'src/app/core/models/produto-descricao.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroProdutodescricaoService {

  constructor() { } 

  private subject = new Subject<FiltroModalProdutoDescricaoViewModel>();

  asObservable(): Observable<FiltroModalProdutoDescricaoViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalProdutoDescricaoViewModel) {
    this.subject.next(filtro); 
  }
}
