import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalUsuarioViewModel } from 'src/app/core/models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroUsuarioService {

  constructor() { } 

  private subject = new Subject<FiltroModalUsuarioViewModel>();

  asObservable(): Observable<FiltroModalUsuarioViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalUsuarioViewModel) {
    this.subject.next(filtro); 
  }
}
