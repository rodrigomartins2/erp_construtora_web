import { Injectable, inject } from '@angular/core';

import { DocumentosContratoApiService } from 'src/app/core/api/documentos-contrato-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { DocumentosContratoFiltroGridViewModel, DocumentosContratoPostViewModel, DocumentosContratoRetornoViewModel, GridDocumentosContratoViewModel } from 'src/app/core/models/documentocontrato.models';

/** Facade de documento do contrato: ponto de acesso das páginas à API DocumentosContratoApiService. */
@Injectable({ providedIn: 'root' })
export class DocumentosContratoFacade extends BaseCrudFacade<DocumentosContratoRetornoViewModel, DocumentosContratoFiltroGridViewModel, GridDocumentosContratoViewModel, DocumentosContratoPostViewModel, DocumentosContratoRetornoViewModel> {
  private readonly api: DocumentosContratoApiService;

  constructor() {
    const api = inject(DocumentosContratoApiService);
    super(api, 'o documento do contrato');
    this.api = api;
  }

  getListDocumentosContrato() {
    return this.runWithState(() => this.api.getListDocumentosContrato(), 'Não foi possível carregar o documento do contrato.');
  }
}
