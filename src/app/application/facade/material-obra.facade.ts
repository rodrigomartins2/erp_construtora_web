import { Injectable, inject } from '@angular/core';

import { MaterialObraApiService } from 'src/app/core/api/material-obra-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridMaterialObraViewModel, MaterialObraFiltroGridViewModel, MaterialObraViewModel } from 'src/app/core/models/material-obra.models';

/** Facade de material da obra: ponto de acesso das páginas à API MaterialObraApiService. */
@Injectable({ providedIn: 'root' })
export class MaterialObraFacade extends BaseCrudFacade<MaterialObraViewModel, MaterialObraFiltroGridViewModel, GridMaterialObraViewModel, MaterialObraViewModel, MaterialObraViewModel> {
  private readonly api: MaterialObraApiService;

  constructor() {
    const api = inject(MaterialObraApiService);
    super(api, 'o material da obra');
    this.api = api;
  }

  getGerarOrdemCompra(obrarID: string, usuarioID: string) {
    return this.runWithState(() => this.api.getGerarOrdemCompra(obrarID, usuarioID), 'Não foi possível carregar o material da obra.');
  }
}
