import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SelectDropModel } from 'src/app/core/models/generics.models';
import { AlterarSenhaViewModel, MenusViewModel } from 'src/app/core/models/login.models';
import { Configuracao } from 'src/app/core/utils/configuracao';

/** Endpoints de autenticação (/api/Login). Somente HTTP — a sessão fica no SessionService. */
@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = new Configuracao().enderecoApi() + 'api/Login';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      accept: 'text/plain',
      'Content-Type': 'application/json-patch+json'
    })
  };

  login(login: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/Login`, login, this.httpOptions);
  }

  verificaUsuario(login: any): Observable<boolean> {
    return this.httpClient.post<any>(`${this.baseUrl}/VerificaUsuario`, login, this.httpOptions);
  }

  postAlteraSenha(alterarSenha: AlterarSenhaViewModel): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/AlteraSenha/`, alterarSenha, this.httpOptions);
  }

  getListMenus(usuarioID: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/Menus/` + usuarioID);
  }

  getListSubMenus(menuID: string, usuarioID: string): Observable<MenusViewModel[]> {
    return this.httpClient.get<MenusViewModel[]>(`${this.baseUrl}/SubMenus/` + menuID + `/` + usuarioID);
  }

  getSelectEmpresaGrupo(): Observable<SelectDropModel[]> {
    return this.httpClient.get<SelectDropModel[]>(`${this.baseUrl}/SelectEmpresaGrupo/`);
  }

  getListPermissoes(usuarioID: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/Permissoes/` + usuarioID);
  }
}
