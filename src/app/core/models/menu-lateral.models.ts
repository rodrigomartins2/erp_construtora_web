/**
 * Menu normalizado usado pelo layout (header, menu lateral).
 * O backend devolve { menu, url, imagemUrl, ordem, subMenus: [{ subMenu, componentes: [{ componente, url }] }] };
 * a MenuFacade converte para este formato.
 */
export interface MenusViewModel {
  menuID: string;
  descricao: string;
  imagemUrl: string;
  /** Rota direta do menu (quando o menu não tem submenus). */
  identificador?: string | null;
  subMenus: SubMenusViewModel[];
}

export interface SubMenusViewModel {
  menuID: string;
  subMenuID: string;
  descricao: string;
  /** Rota direta do submenu (quando não há componentes). */
  identificador?: string | null;
  componentes: ComponentesViewModel[];
}

export interface ComponentesViewModel {
  subMenuID: string;
  componenteID: string;
  descricao: string;
  /** Rota relativa a /app (ex.: "listmarca"). */
  identificador: string;
}
