import { Injectable, inject } from '@angular/core';

import { RelatorioApiService } from 'src/app/core/api/relatorio-api.service';
import { BaseFacade } from 'src/app/application/shared/base.facade';

/** Facade de relatório: ponto de acesso das páginas à API RelatorioApiService. */
@Injectable({ providedIn: 'root' })
export class RelatorioFacade extends BaseFacade {
  private readonly api = inject(RelatorioApiService);

  getRelExpedicaoDocumento(codigo: string) {
    return this.runWithState(() => this.api.getRelExpedicaoDocumento(codigo), 'Não foi possível carregar o relatório.');
  }

  getRelPosicaoEstoque(codigo: string) {
    return this.runWithState(() => this.api.getRelPosicaoEstoque(codigo), 'Não foi possível carregar o relatório.');
  }

  getRelOrdemCompra(codigo: string) {
    return this.runWithState(() => this.api.getRelOrdemCompra(codigo), 'Não foi possível carregar o relatório.');
  }

  getRelMovimentacaoEstoque(codigo: string) {
    return this.runWithState(() => this.api.getRelMovimentacaoEstoque(codigo), 'Não foi possível carregar o relatório.');
  }

  getRelSituacaoDocContrato(empresa: string, situacao: string) {
    return this.runWithState(() => this.api.getRelSituacaoDocContrato(empresa, situacao), 'Não foi possível carregar o relatório.');
  }

  getRelContratoVencimento(dtInicio: string, dtFim: string, empresa: string, situacao: string) {
    return this.runWithState(() => this.api.getRelContratoVencimento(dtInicio, dtFim, empresa, situacao), 'Não foi possível carregar o relatório.');
  }
}
