import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalEntradaSaidaViewModel } from 'src/app/core/models/entrada-saida.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroEntradasaidaService {

  constructor() { } 

  private subject = new Subject<FiltroModalEntradaSaidaViewModel>();

  asObservable(): Observable<FiltroModalEntradaSaidaViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalEntradaSaidaViewModel) {
    this.subject.next(filtro); 
  }
}
