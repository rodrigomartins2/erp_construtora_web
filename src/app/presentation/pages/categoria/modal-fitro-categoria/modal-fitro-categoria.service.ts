import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalCategoriaViewModel } from 'src/app/core/models/categoria.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroCategoriaService {
  
  constructor() { } 

  private subject = new Subject<FiltroModalCategoriaViewModel>();

  asObservable(): Observable<FiltroModalCategoriaViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalCategoriaViewModel) {
    this.subject.next(filtro); 
  }
}
