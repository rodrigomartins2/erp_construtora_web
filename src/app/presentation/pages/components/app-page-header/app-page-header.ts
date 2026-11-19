import { Location } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { HeaderService } from './header.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastMessageService } from '../../../services-ui/toast-message.service';
import { RoleAccessUiService } from '../../../services-ui/role-access-ui.service';

type PageHeaderMode = 'create' | 'view' | 'edit' | null;

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [ButtonModule, CommonModule, SkeletonModule],
  templateUrl: './app-page-header.html',
  styleUrl: './app-page-header.css',
})
export class AppPageHeader implements AfterViewInit, OnDestroy {
  @ViewChild('anchorList') anchorList!: ElementRef<HTMLDivElement>;
  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('sentinel') sentinel!: ElementRef<HTMLDivElement>;
  private readonly headerService = inject(HeaderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly toastMessageService = inject(ToastMessageService);
  private readonly roleAccess = inject(RoleAccessUiService);

  titleTemplate = this.headerService.titleTemplate;
  title = computed(() => {
    const manualTitle = this.headerService.title();
    if (manualTitle && manualTitle !== 'Página') {
      return manualTitle;
    }
    return this.routeTitle() || 'Página';
  });
  subtitle = this.headerService.subtitle;
  moduleName = this.headerService.moduleName;
  rightButtons = this.headerService.rightButtons;
  showEditButton = this.headerService.showEditButton;
  anchors = this.headerService.anchors;
  saveStatus = this.headerService.saveStatus;
  routeTitle = signal<string>('');
  mode = signal<PageHeaderMode>(null);
  hideBackButtonOnMobile = signal(false);
  hideCreateButton = signal(false);
  hideEditButton = signal(false);
  /** Permissão exigida pela rota de edição (`data.editRole` da rota de visualização). */
  editRole = signal<string | null>(null);
  hideSaveButton = signal(false);
  hideCancelButton = signal(false);
  saveButtonLabel = signal('Salvar');
  createButtonLabel = signal('Cadastrar');
  isMobileViewport = signal(this.isViewportMobile());
  activeRoute: ActivatedRoute | null = null;

  showBackButton = computed(() => {
    if (this.headerService.hideBackButton()) {
      return false;
    }
    if (this.hideBackButtonOnMobile() && this.isMobileViewport()) {
      return false;
    }
    return this.headerService.buttonBack() || this.hasFormMode();
  });
  showCreateButton = computed(
    () => !this.mode() && !this.hideCreateButton() && !!this.headerService.createAction(),
  );
  showCancelButton = computed(
    () => (this.mode() === 'create' || this.mode() === 'edit') && !this.hideCancelButton(),
  );
  showSaveButton = computed(
    () => (this.mode() === 'create' || this.mode() === 'edit') && !this.hideSaveButton(),
  );
  showRouteEditButton = computed(
    () =>
      this.mode() === 'view' &&
      !this.showEditButton() &&
      !this.hideEditButton() &&
      !this.headerService.forceHideEditButton() &&
      this.hasEditRole(),
  );

  editButtonLabel = computed(() => {
    const moduleName = this.moduleName();
    if (moduleName) {
      return `Alterar ${moduleName}`;
    }

    let title = this.normalizeEditTitle(this.title());
    title = title.replace(/^(Visualizar|Cadastro de|Edição de|Novo|Nova|Editar)\s+/i, '');

    if (title.endsWith('s') && title !== 'Status' && !title.endsWith('is')) {
      title = title.slice(0, -1);
    }

    return 'Editar';
  });

  isSticky = signal(false);
  activeAnchor = signal<string>('');
  showLeftArrow = signal(false);
  showRightArrow = signal(false);
  materialIconsReady = signal(false);

  headerHeight = 0;
  private resizeObserver: ResizeObserver | null = null;

  private onScrollCapture = () => {
    this.onWindowScroll();
  };

  constructor() {
    effect(() => {
      this.anchors();
      setTimeout(() => {
        this.updateArrowVisibility();
        this.updateHeaderHeight();
      }, 100);
    });

    this.updateRouteHeader();
    this.waitForMaterialIcons();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteHeader();
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateHeaderHeight();
      this.updateArrowVisibility();
    }, 100);

    if (this.anchorList) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateArrowVisibility();
        this.updateHeaderHeight();
      });
      this.resizeObserver.observe(this.anchorList.nativeElement);
    }

    if (this.headerContainer) {
      const headerResizeObserver = new ResizeObserver(() => {
        this.updateHeaderHeight();
      });
      headerResizeObserver.observe(this.headerContainer.nativeElement);
    }

    // Add scroll listener with capture to detect scrolls in parent containers
    window.addEventListener('scroll', this.onScrollCapture, true);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    document.documentElement.style.setProperty('--page-header-height', '0px');
    window.removeEventListener('scroll', this.onScrollCapture, true);
  }

  private getAppHeaderHeight(): number {
    const appHeaderHeightStr = getComputedStyle(document.documentElement)
      .getPropertyValue('--app-header-height')
      .trim();
    const appHeaderHeight = Number.parseFloat(appHeaderHeightStr);

    return Number.isFinite(appHeaderHeight) ? appHeaderHeight : 72;
  }

  private updateHeaderHeight() {
    if (this.headerContainer) {
      this.headerHeight = this.headerContainer.nativeElement.offsetHeight;
      document.documentElement.style.setProperty('--page-header-height', `${this.headerHeight}px`);
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.isMobileViewport.set(this.isViewportMobile());
    this.updateArrowVisibility();
    this.updateHeaderHeight();
  }

  updateArrowVisibility() {
    if (!this.anchorList) {
      this.showLeftArrow.set(false);
      this.showRightArrow.set(false);
      return;
    }

    const el = this.anchorList.nativeElement;
    const hasOverflow = el.scrollWidth > el.clientWidth + 1;
    const isAtStart = el.scrollLeft <= 0;
    const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;

    this.showLeftArrow.set(hasOverflow && !isAtStart);
    this.showRightArrow.set(hasOverflow && !isAtEnd);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.sentinel || !this.headerContainer) return;

    const rect = this.sentinel.nativeElement.getBoundingClientRect();

    if (!this.isSticky()) {
      this.headerHeight = this.headerContainer.nativeElement.offsetHeight;
    }

    const topBarHeight = this.getAppHeaderHeight();

    if (rect.top < topBarHeight - 1) {
      if (!this.isSticky()) {
        this.isSticky.set(true);
      }
    } else if (this.isSticky()) {
      this.isSticky.set(false);
    }
  }

  onAnchorScroll() {
    this.updateArrowVisibility();
  }

  onClickBack(): void {
    const action = this.headerService.buttonBackAction();
    if (action) {
      action();
      return;
    }

    if (this.hasFormMode()) {
      this.router.navigateByUrl(this.getListUrl());
      return;
    }

    this.location.back();
  }

  onEditClick(): void {
    const action = this.headerService.editAction();
    if (action) action();
  }

  onCreateClick(): void {
    const action = this.headerService.createAction();
    if (action) {
      action();
      return;
    }

    this.toastMessageService.add({
      severity: 'warn',
      summary: 'Acesso negado',
      detail: 'Você não tem permissão para cadastrar este registro.',
    });
  }

  onSaveClick(): void {
    const action = this.headerService.saveAction();
    if (action) {
      action();
    }
  }

  onCancelClick(): void {
    const action = this.headerService.cancelAction();
    if (action) {
      action();
      return;
    }

    this.location.back();
  }

  onRouteEditClick(): void {
    const editRole = this.editRole();
    if (editRole && !this.roleAccess.requireRole(editRole)) return;

    const id = this.activeRoute?.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    const editUrl = this.router.url.split('?')[0].replace(/\/view\/[^/]+$/, `/edit/${id}`);

    this.router.navigateByUrl(editUrl);
  }

  scrollAnchors(direction: 'left' | 'right'): void {
    if (!this.anchorList) return;

    const container = this.anchorList.nativeElement;
    const scrollAmount = 200;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollToAnchor(elementId: string): void {
    this.activeAnchor.set(elementId);

    const element = document.getElementById(elementId);
    const scrollContainer = document.querySelector('.app-main-content');

    if (element && scrollContainer) {
      const headerOffset = this.headerHeight + 80;
      const elementPosition = element.getBoundingClientRect().top;
      const containerRect = scrollContainer.getBoundingClientRect();

      // Calculate position relative to the scroll container
      const offsetPosition =
        scrollContainer.scrollTop + elementPosition - containerRect.top - headerOffset;

      scrollContainer.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  private normalizeEditTitle(value: string): string {
    let title = value.trim();

    title = title.replace(
      /^(Visualizar|Cadastro de|Cadastrar|Edicao de|Edi[cç][aã]o de|Novo|Nova|Editar)\s+/i,
      '',
    );

    if (title.endsWith('s') && title !== 'Status' && !title.endsWith('is')) {
      title = title.slice(0, -1);
    }

    return title || 'Registro';
  }

  private updateRouteHeader(): void {
    this.activeRoute = this.getDeepestRoute(this.route);
    const data = this.activeRoute.snapshot.data;

    this.routeTitle.set(this.resolveRouteTitle());
    this.mode.set(this.getRouteMode(this.activeRoute.snapshot));
    this.hideBackButtonOnMobile.set(data['hideBackButtonOnMobile'] === true);
    this.hideCreateButton.set(data['hideCreateButton'] === true);
    this.hideEditButton.set(data['hideEditButton'] === true);
    this.editRole.set(typeof data['editRole'] === 'string' ? data['editRole'] : null);
    this.hideSaveButton.set(data['hideSaveButton'] === true);
    this.hideCancelButton.set(data['hideCancelButton'] === true);
    this.saveButtonLabel.set(
      typeof data['saveButtonLabel'] === 'string' ? data['saveButtonLabel'] : 'Salvar',
    );
    this.createButtonLabel.set(
      typeof data['createButtonLabel'] === 'string' ? data['createButtonLabel'] : 'Cadastrar',
    );
    setTimeout(() => this.updateHeaderHeight(), 0);
  }

  /**
   * Título da página: usa `data.title`; se não houver, `data.breadcrumb`
   * (string ou array, padrão das rotas deste sistema). Vale o mais profundo definido.
   */
  private resolveRouteTitle(): string {
    let titulo = '';
    let atual: ActivatedRoute | null = this.route.root;

    while (atual) {
      const data = atual.snapshot.data;
      const valor = data['title'] ?? data['breadcrumb'];
      const texto = Array.isArray(valor) ? valor[0] : valor;
      if (typeof texto === 'string' && texto.trim()) {
        titulo = texto;
      }
      atual = atual.firstChild;
    }

    return titulo;
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    let currentRoute = route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute;
  }

  private getRouteMode(snapshot: ActivatedRouteSnapshot): PageHeaderMode {
    const mode = snapshot.data['mode'];

    return mode === 'create' || mode === 'view' || mode === 'edit' ? mode : null;
  }

  private hasEditRole(): boolean {
    const editRole = this.editRole();
    return !editRole || this.roleAccess.hasRole(editRole);
  }

  private hasFormMode(): boolean {
    return this.mode() === 'create' || this.mode() === 'view' || this.mode() === 'edit';
  }

  private isViewportMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 1300;
  }

  private getListUrl(): string {
    const currentUrl = this.router.url.split('?')[0];
    const listUrl = currentUrl.replace(/\/(?:form|view\/[^/]+|edit\/[^/]+)$/, '');

    return listUrl || '/app';
  }

  private waitForMaterialIcons(): void {
    const fonts = document.fonts;

    if (!fonts?.load) {
      this.materialIconsReady.set(true);
      return;
    }

    fonts
      .load('24px "Material Symbols Outlined"')
      .then(() => this.materialIconsReady.set(true))
      .catch(() => this.materialIconsReady.set(true));
  }
}
