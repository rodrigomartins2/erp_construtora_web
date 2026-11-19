import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FiltroModalPessoaViewModel } from 'src/app/core/models/pessoa.models';

@Injectable({
  providedIn: 'root'
})
export class ModalFitroPessoaService {

  constructor() { } 

  private subject = new Subject<FiltroModalPessoaViewModel>();

  asObservable(): Observable<FiltroModalPessoaViewModel> {
    return this.subject.asObservable();
  }

  setFiltro(filtro: FiltroModalPessoaViewModel) {
    this.subject.next(filtro); 
  }
}
