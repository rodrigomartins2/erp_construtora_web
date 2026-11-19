import { Injectable, inject } from '@angular/core';

import { EntradaSaidaApiService } from 'src/app/core/api/entrada-saida-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { EntradaPostViewModel, EntradaSaidaFiltroGridViewModel, EntradaSaidaRetornoViewModel, GridEntradaSaidaViewModel, SaidaPostViewModel } from 'src/app/core/models/entrada-saida.models';
import { SelectDropModel } from 'src/app/core/models/generics.models';

/** Facade de entrada/saída: ponto de acesso das páginas à API EntradaSaidaApiService. */
@Injectable({ providedIn: 'root' })
export class EntradaSaidaFacade extends BaseCrudFacade<EntradaSaidaRetornoViewModel, EntradaSaidaFiltroGridViewModel, GridEntradaSaidaViewModel, any, any> {
  private readonly api: EntradaSaidaApiService;

  constructor() {
    const api = inject(EntradaSaidaApiService);
    super(api, 'a entrada/saída');
    this.api = api;
  }

  getListEntradaSaida() {
    return this.runWithState(() => this.api.getListEntradaSaida(), 'Não foi possível carregar a entrada/saída.');
  }

  postEntradaInserir(dados: EntradaPostViewModel) {
    return this.runWithState(() => this.api.postEntradaInserir(dados), 'Não foi possível salvar a entrada/saída.');
  }

  postEntradaAtualiza(dados: EntradaPostViewModel) {
    return this.runWithState(() => this.api.postEntradaAtualiza(dados), 'Não foi possível salvar a entrada/saída.');
  }

  postSaidaInserir(dados: SaidaPostViewModel) {
    return this.runWithState(() => this.api.postSaidaInserir(dados), 'Não foi possível salvar a entrada/saída.');
  }

  postSaidaAtualiza(dados: SaidaPostViewModel) {
    return this.runWithState(() => this.api.postSaidaAtualiza(dados), 'Não foi possível salvar a entrada/saída.');
  }
}
