import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DocumentoContrato } from 'src/app/core/models/documentocontrato.models';

@Injectable({
  providedIn: 'root'
})
export class ModalCadastroDocumentoService {
  
  constructor() { } 

  private subject = new Subject<DocumentoContrato>();

  asObservable(): Observable<DocumentoContrato> {
    return this.subject.asObservable();
  }

  setFiltro(contrato: DocumentoContrato) {
    this.subject.next(contrato);
  }
}
