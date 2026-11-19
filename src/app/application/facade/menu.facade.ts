import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { BaseFacade } from 'src/app/application/shared/base.facade';
import { AuthApiService } from 'src/app/core/api/auth-api.service';
import { ComponentesViewModel, MenusViewModel, SubMenusViewModel } from 'src/app/core/models/menu-lateral.models';

/**
 * Menus do usuário para o layout. Converte o formato do backend
 * ({ menu, url, imagemUrl, subMenus: [{ subMenu, componentes: [{ componente, url }] }] })
 * para o formato usado pelo header e pelo menu lateral.
 */
@Injectable({ providedIn: 'root' })
export class MenuFacade extends BaseFacade {
  private readonly api = inject(AuthApiService);
  private readonly cache = new Map<string, Observable<MenusViewModel[]>>();

  getMenus(usuarioID: string): Observable<MenusViewModel[]> {
    const cached = this.cache.get(usuarioID);
    if (cached) {
      return cached;
    }

    const req$ = this.runWithState(
      () => this.api.getListMenus(usuarioID).pipe(map((menus) => this.normalizar(menus))),
      'Não foi possível carregar os menus.'
    ).pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.cache.set(usuarioID, req$);
    return req$;
  }

  limparCache(): void {
    this.cache.clear();
  }

  private normalizar(menus: any[] | null | undefined): MenusViewModel[] {
    return (menus ?? []).map((menu, i) => {
      const menuID = String(menu?.menuID ?? menu?.ordem ?? i);
      const subMenus: SubMenusViewModel[] = (menu?.subMenus ?? []).map((sub: any, j: number) => {
        const subMenuID = `${menuID}-${sub?.subMenuID ?? j}`;
        const componentes: ComponentesViewModel[] = (sub?.componentes ?? []).map((comp: any, k: number) => ({
          subMenuID,
          componenteID: String(comp?.componenteID ?? `${subMenuID}-${k}`),
          descricao: comp?.componente ?? comp?.descricao ?? '',
          identificador: this.rota(comp?.url ?? comp?.identificador)
        }));
        return {
          menuID,
          subMenuID,
          descricao: sub?.subMenu ?? sub?.descricao ?? '',
          identificador: componentes.length ? null : this.rota(sub?.url ?? sub?.identificador) || null,
          componentes
        };
      });

      const url = menu?.url && menu.url !== '#' ? this.rota(menu.url) : null;
      return {
        menuID,
        descricao: menu?.menu ?? menu?.descricao ?? '',
        imagemUrl: menu?.imagemUrl ?? '',
        identificador: url,
        subMenus
      };
    });
  }

  /** Normaliza a rota do backend para ser relativa a /app (ex.: "/app/listmarca" -> "listmarca"). */
  private rota(url: string | null | undefined): string {
    return String(url ?? '')
      .trim()
      .replace(/^\/+/, '')
      .replace(/^app\/?/, '');
  }
}
