import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';

import { SessionFacade } from 'src/app/application/facade/session.facade';
import { MenusViewModel } from 'src/app/core/models/menu-lateral.models';
import { ActionsUiService } from 'src/app/presentation/services-ui/actions-ui.service';
import { EmpresaLogoService } from 'src/app/presentation/services-ui/empresa-logo.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, MenuModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css'
})
export class AppHeader implements OnInit, AfterViewInit, OnDestroy {
  @Input() itens: MenusViewModel[] = [];
  @Input() loadingMenu = true;

  @HostBinding('class.mobile-menu-active') get isMobileMenuOpen(): boolean {
    return this.mobileMenuAberto;
  }

  @ViewChild('headerRoot') headerRoot!: ElementRef<HTMLDivElement>;
  @ViewChild('menuUsuarioPopup') menuUsuarioPopup!: Menu;
  @Output() clickModalPerfil = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly sessionFacade = inject(SessionFacade);
  private readonly actionsUiService = inject(ActionsUiService);
  readonly empresaLogo = inject(EmpresaLogoService);

  menuUsuario: MenuItem[] = [];
  mobileMenuAberto = false;
  mobileMenuID: string | null = null;
  mobileSubMenuID: string | null = null;
  selectedIdentificador: string | null = null;
  placeholderSkeletons = new Array(6);
  private headerResizeObserver: ResizeObserver | null = null;

  readonly nomeUsuario = this.sessionFacade.nomeUsuario;
  readonly funcaoUsuario = this.sessionFacade.funcaoUsuario;
  readonly loginUsuario = this.sessionFacade.loginUsuario;
  readonly iniciaisUsuario = this.sessionFacade.iniciaisUsuario;

  ngOnInit(): void {
    this.montaMenuUsuario();
  }

  ngAfterViewInit(): void {
    this.updateHeaderHeightCssVar();

    if (this.headerRoot) {
      this.headerResizeObserver = new ResizeObserver(() => this.updateHeaderHeightCssVar());
      this.headerResizeObserver.observe(this.headerRoot.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.headerResizeObserver?.disconnect();
    document.documentElement.style.setProperty('--app-header-height', '72px');
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 640) {
      this.mobileMenuAberto = false;
    }
  }

  get menus(): MenusViewModel[] {
    return this.itens ?? [];
  }

  get isHomeSelected(): boolean {
    const url = this.router.url.replace(/\/$/, '');
    return url === '/app' || url === '/app/dashboard';
  }

  getMenuIconClass(menu: MenusViewModel): string {
    return `${menu.imagemUrl?.trim() || 'pi pi-folder'} text-lg text-[#087CF5]`;
  }

  montaMenuUsuario(): void {
    this.menuUsuario = [
      {
        label: this.nomeUsuario() || 'Usuário',
        icon: 'pi pi-user',
        disabled: true,
        styleClass: 'header-user-menu-info'
      },
      {
        label: 'Alterar senha',
        icon: 'pi pi-key',
        style: { fontSize: '13px', width: '100%' },
        command: () => this.editarPerfil()
      },
      {
        label: 'Sair',
        icon: 'pi pi-power-off',
        style: { fontSize: '13px' },
        command: () => this.logout()
      }
    ];
  }

  toggleMenuUsuario(event: MouseEvent): void {
    event.stopPropagation();
    this.menuUsuarioPopup.toggle(event);
  }

  toggleMenuUsuarioMobile(event: MouseEvent): void {
    if (window.innerWidth > 640) {
      return;
    }
    event.stopPropagation();
    this.menuUsuarioPopup.toggle(event);
  }

  editarPerfil(): void {
    this.clickModalPerfil.emit();
  }

  logout(): void {
    this.mobileMenuAberto = false;
    this.actionsUiService.confirmLogout(() => this.logoutClick.emit());
  }

  toggleMobileMenu(): void {
    this.mobileMenuAberto = !this.mobileMenuAberto;
  }

  fecharMobileMenu(): void {
    this.mobileMenuAberto = false;
  }

  navigateHome(): void {
    this.selectedIdentificador = null;
    this.mobileMenuID = null;
    this.mobileSubMenuID = null;
    this.mobileMenuAberto = false;
    this.navigateTo('/app');
  }

  toggleMobileMenuGroup(menu: MenusViewModel): void {
    if (menu.identificador) {
      this.selectComponente(menu.identificador);
      return;
    }
    this.mobileMenuID = this.mobileMenuID === menu.menuID ? null : menu.menuID;
    this.mobileSubMenuID = null;
  }

  toggleMobileSubMenu(subMenuID: string): void {
    this.mobileSubMenuID = this.mobileSubMenuID === subMenuID ? null : subMenuID;
  }

  selectComponente(identificador: string | null | undefined): void {
    this.selectedIdentificador = identificador ?? null;
    this.mobileMenuAberto = false;

    if (!identificador || identificador === 'undefined' || identificador === 'null') {
      this.navigateTo('/app');
      return;
    }

    this.navigateTo(`/app/${identificador}`);
  }

  private navigateTo(url: string): void {
    void this.router.navigateByUrl(url).then((navigated) => {
      if (navigated) {
        this.scrollPageToTop();
      }
    });
  }

  private scrollPageToTop(): void {
    requestAnimationFrame(() => {
      document.querySelector('.app-main-content')?.scrollTo({ top: 0, behavior: 'auto' });
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  private updateHeaderHeightCssVar(): void {
    if (!this.headerRoot) {
      return;
    }
    const headerHeight = this.headerRoot.nativeElement.offsetHeight;
    document.documentElement.style.setProperty('--app-header-height', `${headerHeight}px`);
  }
}
