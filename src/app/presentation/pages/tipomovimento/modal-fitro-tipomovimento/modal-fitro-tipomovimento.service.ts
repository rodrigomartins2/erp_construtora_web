import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalTipoMovimentoViewModel } from 'src/app/core/models/tipo-movimento.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroTipomovimentoService {

  constructor() { } 

  private subject = new Subject<FiltroModalTipoMovimentoViewModel>();

  asObservable(): Observable<FiltroModalTipoMovimentoViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalTipoMovimentoViewModel) {
    this.subject.next(filtro); 
  }
}
