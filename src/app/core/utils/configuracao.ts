import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RouteStack } from 'src/app/core/models/generics.models';
import { Criptografia } from 'src/app/core/utils/criptografia';

export class Configuracao {
  public enderecoApi() {
    return environment.url.endsWith('/') ? environment.url : `${environment.url}/`;
  }

  public static temPermissao(
    permissao: string[],
    permissaoUsuario: string[]
  ): boolean {
    for (let role of permissao) {
      if (permissaoUsuario.includes(role)) {
        return true;
      }
    }
    return false;
  }

  public recuperarDados() {
    return this.recuperarDadosCriptografados('LOCALSTORAGE_USER_GER');
  }

  public recuperarEmpresa() {    
    return JSON.parse(window.localStorage.getItem('LOCALSTORAGE_EMPRESA') || '{}');
  }

  public recuperarAlterarSenha() {
    return this.recuperarDadosCriptografados('LOCALSTORAGE_ALTERAR_SENHA');
  }

  private recuperarDadosCriptografados(chave: string) {
    try {
      var dados = JSON.parse(window.localStorage.getItem(chave) || 'null');
      var cripto = Criptografia.fromBinary(dados);

      return cripto ? JSON.parse(cripto) : {};
    } catch {
      window.localStorage.removeItem(chave);
      return {};
    }
  }

  private routeStack = [] as RouteStack[];

  public goTo(router: Router, route: string, ...params: any[]): void {
    if (params && params.length) {
      router.navigate(this.separateArrays(route, params));
    } else {
      router.navigate([route]);
    }
    this.routeStack.push({
      route: route,
      caller: router.url,
      params: params ? params : [],
    } as RouteStack);
  }

  private separateArrays(route: string, params: any): string[] {
    const array = [];
    array.push(route);
    if (typeof params === 'string') {
      array.push(params);
      return array;
    }

    for (let i = 0; i < params.length; i++) {
      array.push(params[i]);
    }

    return array;
  }

  public getBase64(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (!file) {
        resolve("");
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      }
    });
  }
}
