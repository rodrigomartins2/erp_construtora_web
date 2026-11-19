import { Injectable, inject } from '@angular/core';

import { PessoaApiService } from 'src/app/core/api/pessoa-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { GridPessoaViewModel, PessoaFiltroGridViewModel, PessoaRetornoViewModel, PessoaViewModel } from 'src/app/core/models/pessoa.models';

/** Facade de pessoa: ponto de acesso das páginas à API PessoaApiService. */
@Injectable({ providedIn: 'root' })
export class PessoaFacade extends BaseCrudFacade<PessoaRetornoViewModel, PessoaFiltroGridViewModel, GridPessoaViewModel, PessoaViewModel, PessoaViewModel> {
  private readonly api: PessoaApiService;

  constructor() {
    const api = inject(PessoaApiService);
    super(api, 'a pessoa');
    this.api = api;
  }

  getListPessoa(tipo: string) {
    return this.runWithState(() => this.api.getListPessoa(tipo), 'Não foi possível carregar a pessoa.');
  }
}
