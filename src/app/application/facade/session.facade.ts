import { Injectable, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from 'src/app/core/auth/session.service';

/** Sessão do usuário logado para a camada de apresentação (layout, header, guards). */
@Injectable({ providedIn: 'root' })
export class SessionFacade {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  readonly usuario = this.session.usuario;
  readonly isAuthenticated = this.session.isAutenticado;
  readonly usuarioID = this.session.usuarioID;
  readonly nomeUsuario = computed<string>(() => this.session.usuario()?.nome ?? '');
  readonly funcaoUsuario = computed<string>(() => this.session.usuario()?.funcao ?? '');
  readonly loginUsuario = computed<string>(() => this.session.usuario()?.login ?? '');

  /** Iniciais do nome para o avatar do header. */
  readonly iniciaisUsuario = computed<string>(() => {
    const nomes = this.nomeUsuario().trim().split(/\s+/).filter(Boolean);
    if (!nomes.length) {
      return '';
    }
    const iniciais = nomes.length > 1 ? nomes[0][0] + nomes[nomes.length - 1][0] : nomes[0][0];
    return iniciais.toUpperCase();
  });

  dadosUsuario() {
    return this.session.dadosUsuario();
  }

  empresa(): string {
    return this.session.empresa();
  }

  getToken(): string | null {
    return this.session.getToken();
  }

  isLogado(): boolean {
    return this.session.isLogado();
  }

  /**
   * Controle por papéis ainda não existe neste backend (o acesso é definido pelos menus
   * liberados ao usuário). Mantido para compatibilidade com os componentes do layout.
   */
  hasRole(_role: string): boolean {
    return this.isAuthenticated();
  }

  /** Encerra a sessão e volta para o login. */
  logout(): void {
    this.session.limparSessao();
    void this.router.navigate(['/login']);
  }
}
