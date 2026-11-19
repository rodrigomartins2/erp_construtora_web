import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenusViewModel } from 'src/app/core/models/menu-lateral.models';
import { ActionsUiService } from 'src/app/presentation/services-ui/actions-ui.service';
import { EmpresaLogoService } from 'src/app/presentation/services-ui/empresa-logo.service';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [],
  templateUrl: './app-menu-lateral.html',
  styleUrl: './app-menu-lateral.css',
})
export class AppMenuLateral {
  @Input() itens: MenusViewModel[] = [];
  @Input() loading = true;
  @Output() logoutClick = new EventEmitter<void>();

  @HostBinding('class.expanded') isExpanded = false;

  selectedMenuID: string | null = null;
  selectedSubMenuID: string | null = null;
  selectedIdentificador: string | null = null;
  flyoutMenuID: string | null = null;
  pinnedFlyoutMenuID: string | null = null;
  flyoutTop = 0;
  placeholderSkeletons = new Array(6);
  private hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly actionsUiService = inject(ActionsUiService);
  readonly empresaLogo = inject(EmpresaLogoService);

  constructor(
    private readonly router: Router,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;

    if (target && this.elementRef.nativeElement.contains(target)) {
      return;
    }

    this.closeFlyout();
  }

  @HostListener('mouseleave')
  onHostMouseLeave(): void {
    this.onMouseLeave();
  }

  get menus(): MenusViewModel[] {
    return this.itens ?? [];
  }

  get isHomeSelected(): boolean {
    const url = this.router.url.split('?')[0].replace(/\/+$/, '');
    return url === '/app' || url === '/app/dashboard';
  }

  get activeFlyoutMenuID(): string | null {
    return this.pinnedFlyoutMenuID ?? this.flyoutMenuID;
  }

  getMenuIconClass(menu: MenusViewModel, expanded = false): string {
    const iconClass = menu.imagemUrl?.trim() || 'pi pi-folder';
    return expanded ? `${iconClass} text-lg text-[#087CF5]` : `${iconClass} text-xl`;
  }

  toggleMenu(): void {
    this.closeFlyout();
    this.isExpanded = !this.isExpanded;
  }

  /** Menu com rota direta navega; menu com submenus abre/fecha o grupo. */
  onMenuClick(menu: MenusViewModel, event: MouseEvent): void {
    if (menu.identificador) {
      this.selectComponente(menu.identificador);
      return;
    }
    this.openFlyout(menu.menuID, event);
  }

  onMenuGroupClick(menu: MenusViewModel): void {
    if (menu.identificador) {
      this.selectComponente(menu.identificador);
      return;
    }
    this.toggleMenuGroup(menu.menuID);
  }

  toggleMenuGroup(menuID: string): void {
    this.selectedMenuID = this.selectedMenuID === menuID ? null : menuID;
    this.selectedSubMenuID = null;
  }

  toggleSubMenu(subMenuID: string): void {
    this.selectedSubMenuID = this.selectedSubMenuID === subMenuID ? null : subMenuID;
  }

  openFlyout(menuID: string, event?: MouseEvent): void {
    this.clearHoverTimeout();

    const target = event?.currentTarget as HTMLElement | null;

    if (event?.type === 'click') {
      if (this.activeFlyoutMenuID === menuID && this.pinnedFlyoutMenuID === menuID) {
        this.closeFlyout();
        return;
      }

      this.pinnedFlyoutMenuID = menuID;
    } else if (this.pinnedFlyoutMenuID && this.pinnedFlyoutMenuID !== menuID) {
      return;
    }

    if (target) {
      this.flyoutTop = target.getBoundingClientRect().top;
    }

    this.flyoutMenuID = menuID;
    this.selectedSubMenuID = null;
  }

  onMouseLeave(): void {
    if (this.pinnedFlyoutMenuID) {
      return;
    }

    this.hoverTimeout = setTimeout(() => {
      this.flyoutMenuID = null;
    }, 150);
  }

  onPanelMouseEnter(): void {
    this.clearHoverTimeout();
  }

  onPanelMouseLeave(): void {
    if (this.pinnedFlyoutMenuID) {
      return;
    }

    this.onMouseLeave();
  }

  selectComponente(identificador: string | null | undefined): void {
    this.selectedIdentificador = identificador ?? null;
    this.closeFlyout();
    this.collapseSidebarIfExpanded();

    if (!identificador || identificador === 'undefined' || identificador === 'null') {
      this.navigateTo('/app');
      return;
    }

    this.navigateTo(`/app/${identificador}`);
  }

  navigateHome(): void {
    this.selectedMenuID = null;
    this.selectedSubMenuID = null;
    this.selectedIdentificador = null;
    this.closeFlyout();
    this.collapseSidebarIfExpanded();
    this.navigateTo('/app');
  }

  navigateTo(url: string): void {
    this.closeFlyout();
    void this.router.navigateByUrl(url).then((navigated) => {
      if (navigated) {
        this.scrollPageToTop();
      }
    });
  }

  logout(): void {
    this.closeFlyout();
    this.collapseSidebarIfExpanded();

    this.actionsUiService.confirmLogout(() => this.logoutClick.emit());
  }

  private closeFlyout(): void {
    this.clearHoverTimeout();
    this.flyoutMenuID = null;
    this.pinnedFlyoutMenuID = null;
  }

  private collapseSidebarIfExpanded(): void {
    if (this.isExpanded) {
      this.isExpanded = false;
    }
  }

  private clearHoverTimeout(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  private scrollPageToTop(): void {
    requestAnimationFrame(() => {
      document.querySelector('.app-main-content')?.scrollTo({ top: 0, behavior: 'auto' });
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }
}
