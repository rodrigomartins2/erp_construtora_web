import { Injectable, computed, signal } from '@angular/core';

import { LoginDadosModel } from 'src/app/core/models/login.models';
import { Criptografia } from 'src/app/core/utils/criptografia';

const CHAVE_USUARIO = 'LOCALSTORAGE_USER_GER';
const CHAVE_EMPRESA = 'LOCALSTORAGE_EMPRESA';
const CHAVE_ALTERAR_SENHA = 'LOCALSTORAGE_ALTERAR_SENHA';

/**
 * Dados da sessão do usuário guardados no localStorage (criptografados).
 * Mantém as mesmas chaves usadas antes para não derrubar sessões já abertas.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly _usuario = signal<any>(this.lerCriptografado(CHAVE_USUARIO));

  /** Dados do usuário logado (resposta do login). */
  readonly usuario = computed(() => this._usuario());
  readonly isAutenticado = computed(() => !!this._usuario()?.usuarioID);
  readonly usuarioID = computed<string>(() => String(this._usuario()?.usuarioID ?? ''));

  /** Grava a sessão após um login bem-sucedido. */
  salvarSessao(dados: any, empresa: string): void {
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(Criptografia.toBinary(JSON.stringify(dados))));
    localStorage.setItem(CHAVE_EMPRESA, JSON.stringify(empresa));
    this._usuario.set(dados);
  }

  /** Guarda os dados do login quando o usuário ainda precisa trocar a senha padrão. */
  salvarAlterarSenha(dados: any): void {
    localStorage.setItem(CHAVE_ALTERAR_SENHA, JSON.stringify(dados));
  }

  /** Dados do login pendente de troca da senha padrão. */
  dadosAlterarSenha(): any {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_ALTERAR_SENHA) || 'null') ?? {};
    } catch {
      return {};
    }
  }

  dadosUsuario(): LoginDadosModel | any {
    return this._usuario() ?? {};
  }

  empresa(): string {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_EMPRESA) || '""');
    } catch {
      return '';
    }
  }

  isLogado(): boolean {
    return localStorage.getItem(CHAVE_USUARIO) != null;
  }

  getToken(): string | null {
    const token = this.lerCriptografado(CHAVE_USUARIO)?.token;
    return token ? String(token) : null;
  }

  limparSessao(): void {
    localStorage.removeItem(CHAVE_USUARIO);
    localStorage.removeItem('menus');
    localStorage.removeItem('permissoes');
    this._usuario.set(null);
  }

  private lerCriptografado(chave: string): any {
    try {
      const dados = JSON.parse(localStorage.getItem(chave) || 'null');
      const texto = Criptografia.fromBinary(dados);
      return texto ? JSON.parse(texto) : null;
    } catch {
      localStorage.removeItem(chave);
      return null;
    }
  }
}
