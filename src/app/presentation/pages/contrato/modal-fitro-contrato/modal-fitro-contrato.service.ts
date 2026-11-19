import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalContratoViewModel } from 'src/app/core/models/contrato.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroContratoService {

  constructor() { } 

  private subject = new Subject<FiltroModalContratoViewModel>();

  asObservable(): Observable<FiltroModalContratoViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalContratoViewModel) {
    this.subject.next(filtro); 
  }
}
