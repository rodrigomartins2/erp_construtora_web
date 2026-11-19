import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalUnidadesMedidaViewModel } from 'src/app/core/models/unidade-medida.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroUnidademedidaService {

  constructor() { } 

  private subject = new Subject<FiltroModalUnidadesMedidaViewModel>();

  asObservable(): Observable<FiltroModalUnidadesMedidaViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalUnidadesMedidaViewModel) {
    this.subject.next(filtro); 
  }
}
