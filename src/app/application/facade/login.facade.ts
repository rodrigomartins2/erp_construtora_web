import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { BaseFacade } from 'src/app/application/shared/base.facade';
import { AuthApiService } from 'src/app/core/api/auth-api.service';
import { SessionService } from 'src/app/core/auth/session.service';
import { SelectDropModel } from 'src/app/core/models/generics.models';
import { AlterarSenhaViewModel, MenusViewModel } from 'src/app/core/models/login.models';

/** Login, troca de senha e menus do usuário. */
@Injectable({ providedIn: 'root' })
export class LoginFacade extends BaseFacade {
  private readonly api = inject(AuthApiService);
  private readonly session = inject(SessionService);

  /**
   * Autentica e grava a sessão. Se o usuário ainda usa a senha padrão,
   * só guarda os dados para a troca de senha (a sessão não é aberta).
   */
  login(login: { email: string; senha: string; empresa: string }): Observable<any> {
    return this.runWithState(
      () =>
        this.api.login(login).pipe(
          tap((dados) => {
            if (String(dados?.senhaPadrao).toLowerCase() === 'true') {
              this.session.salvarAlterarSenha(dados);
              return;
            }
            if (dados?.mensagem == null) {
              this.session.salvarSessao(dados, login.empresa);
            }
          })
        ),
      'Não foi possível acessar o sistema.'
    );
  }

  verificaUsuario(login: any): Observable<boolean> {
    return this.runWithState(() => this.api.verificaUsuario(login), 'Não foi possível verificar o usuário.');
  }

  postAlteraSenha(dados: AlterarSenhaViewModel): Observable<any> {
    return this.runWithState(() => this.api.postAlteraSenha(dados), 'Não foi possível alterar a senha.');
  }

  getSelectEmpresaGrupo(): Observable<SelectDropModel[]> {
    return this.runWithState(() => this.api.getSelectEmpresaGrupo(), 'Não foi possível carregar as empresas.');
  }

  getListMenus(usuarioID: string): Observable<any[]> {
    return this.runWithState(() => this.api.getListMenus(usuarioID), 'Não foi possível carregar os menus.');
  }

  getListSubMenus(menuID: string, usuarioID: string): Observable<MenusViewModel[]> {
    return this.runWithState(() => this.api.getListSubMenus(menuID, usuarioID), 'Não foi possível carregar os submenus.');
  }

  getListPermissoes(usuarioID: string): Observable<any[]> {
    return this.runWithState(() => this.api.getListPermissoes(usuarioID), 'Não foi possível carregar as permissões.');
  }

  /** Usuário que precisa trocar a senha padrão (sessão ainda não aberta). */
  dadosAlterarSenha(): any {
    return this.session.dadosAlterarSenha();
  }

  logout(): void {
    this.session.limparSessao();
  }
}
