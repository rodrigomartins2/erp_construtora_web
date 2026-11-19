import { Injectable, inject } from '@angular/core';

import { ViacepApiService } from 'src/app/core/api/viacep-api.service';
import { BaseFacade } from 'src/app/application/shared/base.facade';

/** Facade de endereço do CEP: ponto de acesso das páginas à API ViacepApiService. */
@Injectable({ providedIn: 'root' })
export class ViacepFacade extends BaseFacade {
  private readonly api = inject(ViacepApiService);

  buscarPorCep(cep: string) {
    return this.runWithState(() => this.api.buscarPorCep(cep), 'Não foi possível carregar o endereço do CEP.');
  }
}
