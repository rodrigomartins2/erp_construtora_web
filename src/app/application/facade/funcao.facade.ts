import { Injectable, inject } from '@angular/core';

import { FuncaoApiService } from 'src/app/core/api/funcao-api.service';
import { BaseFacade } from 'src/app/application/shared/base.facade';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de função: ponto de acesso das páginas à API FuncaoApiService. */
@Injectable({ providedIn: 'root' })
export class FuncaoFacade extends BaseFacade {
  private readonly api = inject(FuncaoApiService);

  getListFuncao() {
    return this.runWithState(() => this.api.getListFuncao(), 'Não foi possível carregar a função.');
  }
}
