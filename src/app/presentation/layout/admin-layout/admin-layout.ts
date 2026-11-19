import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ToastModule } from 'primeng/toast';

import { MenuFacade } from 'src/app/application/facade/menu.facade';
import { SessionFacade } from 'src/app/application/facade/session.facade';
import { MenusViewModel } from 'src/app/core/models/menu-lateral.models';
import { AppHeader } from 'src/app/presentation/pages/components/app-header/app-header';
import { AppMenuLateral } from 'src/app/presentation/pages/components/app-menu-lateral/app-menu-lateral';
import { AppPageHeader } from 'src/app/presentation/pages/components/app-page-header/app-page-header';
import { AlterarSenhaDialog } from 'src/app/presentation/components/alterar-senha-dialog/alterar-senha-dialog';
import { buildInfo } from 'src/environments/build-info';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, ToastModule, AppPageHeader, AppHeader, AppMenuLateral, AlterarSenhaDialog],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit {
  @ViewChild('mainContent') mainContent?: ElementRef<HTMLElement>;

  private readonly router = inject(Router);
  private readonly menuFacade = inject(MenuFacade);
  readonly sessionFacade = inject(SessionFacade);

  itens: MenusViewModel[] = [];
  loading = true;
  showHeader = true;
  isHome = false;
  alterarSenhaVisivel = false;
  readonly buildInfo = buildInfo;
  readonly anoAtual = new Date().getFullYear();

  constructor() {
    this.atualizarLayoutPorRota(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.atualizarLayoutPorRota(event.urlAfterRedirects);
        this.scrollToTop();
      });
  }

  ngOnInit(): void {
    const usuarioID = this.sessionFacade.usuarioID();

    if (!usuarioID) {
      this.redirectToLogin();
      return;
    }

    this.menuFacade.getMenus(usuarioID).subscribe({
      next: (menus) => {
        this.itens = menus;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onClickPerfil(): void {
    this.alterarSenhaVisivel = true;
  }

  logout(): void {
    this.menuFacade.limparCache();
    this.sessionFacade.logout();
  }

  private redirectToLogin(): void {
    this.loading = false;
    this.itens = [];
    this.logout();
  }

  private atualizarLayoutPorRota(url: string): void {
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    this.isHome = cleanUrl === '/app' || cleanUrl === '/app/dashboard';

    const isErrorPage =
      cleanUrl.includes('not-found') || cleanUrl.includes('acesso-negado') || cleanUrl.includes('em-construcao');

    this.showHeader = !this.isHome && !isErrorPage;
  }

  private scrollToTop(): void {
    setTimeout(() => {
      this.mainContent?.nativeElement.scrollTo({ top: 0, behavior: 'auto' });
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }
}
