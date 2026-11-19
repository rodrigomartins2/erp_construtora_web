import { Injectable, inject } from '@angular/core';

import { ObraApiService } from 'src/app/core/api/obra-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridObraViewModel, ObraFiltroGridViewModel, ObraPostViewModel, ObraRetornoViewModel } from 'src/app/core/models/obra.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de obra: ponto de acesso das páginas à API ObraApiService. */
@Injectable({ providedIn: 'root' })
export class ObraFacade extends BaseCrudFacade<ObraRetornoViewModel, ObraFiltroGridViewModel, GridObraViewModel, ObraPostViewModel, ObraRetornoViewModel> {
  private readonly api: ObraApiService;

  constructor() {
    const api = inject(ObraApiService);
    super(api, 'a obra');
    this.api = api;
  }

  getListObra() {
    return this.runWithState(() => this.api.getListObra(), 'Não foi possível carregar a obra.');
  }
}
