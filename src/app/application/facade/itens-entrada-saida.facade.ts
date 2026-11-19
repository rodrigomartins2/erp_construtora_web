import { Injectable, inject } from '@angular/core';

import { ItensEntradaSaidaApiService } from 'src/app/core/api/itens-entrada-saida-api.service';
import { BaseCrudFacade } from 'src/app/application/shared/base-crud.facade';
import { GridItensEntradaSaidaViewModel, ItensEntradaPostViewModel, ItensEntradaSaidaFiltroGridViewModel, ItensSaidaPostViewModel, MovimentarEstoqueViewModel } from 'src/app/core/models/itens-entrada-saida.models';

/** Facade de item da entrada/saída: ponto de acesso das páginas à API ItensEntradaSaidaApiService. */
@Injectable({ providedIn: 'root' })
export class ItensEntradaSaidaFacade extends BaseCrudFacade<any, ItensEntradaSaidaFiltroGridViewModel, GridItensEntradaSaidaViewModel, ItensEntradaPostViewModel, ItensEntradaPostViewModel> {
  private readonly api: ItensEntradaSaidaApiService;

  constructor() {
    const api = inject(ItensEntradaSaidaApiService);
    super(api, 'o item da entrada/saída');
    this.api = api;
  }

  postInserirSaidas(dados: ItensSaidaPostViewModel) {
    return this.runWithState(() => this.api.postInserirSaidas(dados), 'Não foi possível salvar o item da entrada/saída.');
  }

  postAtualizaEstoque(dados: MovimentarEstoqueViewModel) {
    return this.runWithState(() => this.api.postAtualizaEstoque(dados), 'Não foi possível salvar o item da entrada/saída.');
  }
}
