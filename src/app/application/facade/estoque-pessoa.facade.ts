import { Injectable, inject } from '@angular/core';

import { EstoquePessoaApiService } from 'src/app/core/api/estoque-pessoa-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { EstoquePessoaFiltroGridViewModel, EstoquePessoaPostViewModel, EstoquePessoaRetornoViewModel, GridEstoquePessoaViewModel } from 'src/app/core/models/estoquepessoa.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { EntradaPostViewModel } from 'src/app/core/models/entrada-saida.models';

/** Facade de estoque: ponto de acesso das páginas à API EstoquePessoaApiService. */
@Injectable({ providedIn: 'root' })
export class EstoquePessoaFacade extends BaseCrudFacade<EstoquePessoaRetornoViewModel, EstoquePessoaFiltroGridViewModel, GridEstoquePessoaViewModel, any, any> {
  private readonly api: EstoquePessoaApiService;

  constructor() {
    const api = inject(EstoquePessoaApiService);
    super(api, 'o estoque');
    this.api = api;
  }

  getListEstoquePessoa() {
    return this.runWithState(() => this.api.getListEstoquePessoa(), 'Não foi possível carregar o estoque.');
  }

  postEntradaInserir(dados: EstoquePessoaPostViewModel) {
    return this.runWithState(() => this.api.postEntradaInserir(dados), 'Não foi possível salvar o estoque.');
  }

  postEntradaAtualiza(dados: EstoquePessoaPostViewModel) {
    return this.runWithState(() => this.api.postEntradaAtualiza(dados), 'Não foi possível salvar o estoque.');
  }
}
