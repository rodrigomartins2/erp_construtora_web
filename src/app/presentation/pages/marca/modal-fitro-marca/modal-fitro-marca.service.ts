import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroMarcaViewModel } from 'src/app/core/models/marca.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroMarcaService {

  constructor() { } 

  private subject = new Subject<FiltroMarcaViewModel>();

  asObservable(): Observable<FiltroMarcaViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroMarcaViewModel) {
    this.subject.next(filtro); 
  }
}
