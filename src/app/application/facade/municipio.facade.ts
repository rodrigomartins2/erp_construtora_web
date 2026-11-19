import { Injectable, inject } from '@angular/core';

import { MunicipioApiService } from 'src/app/core/api/municipio-api.service';
import { BaseFacade } from 'src/app/application/shared/base.facade';
import { Estados, Municipios } from 'src/app/core/models/municipio.models';

/** Facade de município: ponto de acesso das páginas à API MunicipioApiService. */
@Injectable({ providedIn: 'root' })
export class MunicipioFacade extends BaseFacade {
  private readonly api = inject(MunicipioApiService);

  getListMunicipios(id: string) {
    return this.runWithState(() => this.api.getListMunicipios(id), 'Não foi possível carregar o município.');
  }

  getListEstados() {
    return this.runWithState(() => this.api.getListEstados(), 'Não foi possível carregar o município.');
  }
}
