import { Injectable, signal, TemplateRef } from '@angular/core';
import { HeaderAnchor } from './header.types';
import { NavigationEnd, Router } from '@angular/router';
import { ButtonProp } from '../../../../core/models/button.models';
import { filter } from 'rxjs';
export type HeaderSaveStatus = 'idle' | 'saving' | 'saved';

export interface HeaderSaveStatusFlowOptions {
  successTransitionDelayMs?: number;
}

export interface HeaderConfig {
  title: string;
  buttonBack?: boolean;
  rightButtons?: ButtonProp[];
  buttonBackAction?: (() => void) | null;
  showEditButton?: boolean | null;
  moduleName?: string | null;
  subtitle?: string | null;
  preserveSaveStatus?: boolean;
  hideBackButton?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  //private permissionService = inject(PermissionAbstractionService);

  private _title = signal<string>('Página');
  private _titleTemplate = signal<TemplateRef<unknown> | null>(null);
  private _subtitle = signal<string | null>(null);
  private _moduleName = signal<string | null>(null);
  private _buttonBack = signal<boolean>(false);
  private _hideBackButton = signal<boolean>(false);
  private _rightButtons = signal<ButtonProp[]>([]);
  private _buttonBackAction = signal<(() => void) | null>(null);
  private _saveAction = signal<(() => void) | null>(null);
  private _createAction = signal<(() => void) | null>(null);
  private _cancelAction = signal<(() => void) | null>(null);

  private _anchors = signal<HeaderAnchor[]>([]);

  private _showEditButton = signal<boolean>(false);
  private _editAction = signal<(() => void) | null>(null);
  private _forceHideEditButton = signal<boolean>(false);
  private _saveStatus = signal<HeaderSaveStatus | null>(null);
  private saveStatusRequestId = 0;
  private saveStatusTransitionTimer: ReturnType<typeof setTimeout> | null = null;
  private saveStatusFlowOptions: Required<HeaderSaveStatusFlowOptions> = {
    successTransitionDelayMs: 3000,
  };

  title = this._title.asReadonly();
  titleTemplate = this._titleTemplate.asReadonly();
  subtitle = this._subtitle.asReadonly();
  moduleName = this._moduleName.asReadonly();
  buttonBack = this._buttonBack.asReadonly();
  hideBackButton = this._hideBackButton.asReadonly();
  rightButtons = this._rightButtons.asReadonly();
  buttonBackAction = this._buttonBackAction.asReadonly();
  saveAction = this._saveAction.asReadonly();
  createAction = this._createAction.asReadonly();
  cancelAction = this._cancelAction.asReadonly();

  anchors = this._anchors.asReadonly();

  showEditButton = this._showEditButton.asReadonly();
  editAction = this._editAction.asReadonly();
  forceHideEditButton = this._forceHideEditButton.asReadonly();
  saveStatus = this._saveStatus.asReadonly();

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.reset();
    });
  }

  reset() {
    this._title.set('Página');
    this._titleTemplate.set(null);
    this._subtitle.set(null);
    this._moduleName.set(null);
    this._buttonBack.set(false);
    this._hideBackButton.set(false);
    this._rightButtons.set([]);
    this._buttonBackAction.set(null);
    this._saveAction.set(null);
    this._createAction.set(null);
    this._cancelAction.set(null);
    this._anchors.set([]);
    this._showEditButton.set(false);
    this._editAction.set(null);
    this._forceHideEditButton.set(false);
    this.clearSaveStatus();
  }

  setHeader({
    title,
    buttonBack = false,
    rightButtons = [],
    buttonBackAction = null,
    showEditButton = null,
    moduleName = null,
    subtitle = null,
    preserveSaveStatus = false,
    hideBackButton = false,
  }: HeaderConfig) {
    this._title.set(title);
    this._subtitle.set(subtitle);
    this._buttonBack.set(buttonBack);
    this._hideBackButton.set(hideBackButton);
    this._rightButtons.set(rightButtons);
    this._buttonBackAction.set(buttonBackAction);

    this._anchors.set([]);
    this._moduleName.set(moduleName);
    if (!preserveSaveStatus) {
      this.clearSaveStatus();
    }

    if (showEditButton === false) {
      this._showEditButton.set(false);
      this._editAction.set(null);
    } else {
      this.checkAutoEditButton(showEditButton === true);
    }
  }

  setAnchors(anchors: HeaderAnchor[]) {
    this._anchors.set(anchors);
  }

  setManualEditButton(visible: boolean, action: (() => void) | null = null) {
    this._showEditButton.set(visible);
    this._editAction.set(action);
  }

  /** Esconde o botão Editar automático da rota (modo view) por regra da página. */
  setForceHideEditButton(hide: boolean) {
    this._forceHideEditButton.set(hide);
  }

  setRightButtons(buttons: ButtonProp[]): void {
    this._rightButtons.set(buttons);
  }

  setTitleTemplate(template: TemplateRef<unknown> | null): void {
    this._titleTemplate.set(template);
  }

  setCreateAction(action: (() => void) | null) {
    this._createAction.set(action);
  }

  setSaveAction(action: (() => void) | null) {
    this._saveAction.set(action);
  }

  setCancelAction(action: (() => void) | null) {
    this._cancelAction.set(action);
  }

  setSaveStatus(status: HeaderSaveStatus | null) {
    this._saveStatus.set(status);
  }

  initializeSaveStatus(
    options: HeaderSaveStatusFlowOptions = {},
    initialStatus: HeaderSaveStatus = 'idle',
  ) {
    this.saveStatusFlowOptions = {
      ...this.saveStatusFlowOptions,
      ...options,
    };
    this.setSaveStatus(initialStatus);
  }

  startSaveStatusCycle(options: HeaderSaveStatusFlowOptions = {}): number {
    this.saveStatusFlowOptions = {
      ...this.saveStatusFlowOptions,
      ...options,
    };

    this.saveStatusRequestId += 1;
    this.clearSaveStatusTransitionTimer();
    this.setSaveStatus('saving');
    return this.saveStatusRequestId;
  }

  finishSaveStatusSuccess(requestId: number): boolean {
    if (requestId !== this.saveStatusRequestId) return false;

    this.clearSaveStatusTransitionTimer();
    this.saveStatusTransitionTimer = setTimeout(() => {
      if (requestId === this.saveStatusRequestId) {
        this.setSaveStatus('saved');
      }
      this.saveStatusTransitionTimer = null;
    }, this.saveStatusFlowOptions.successTransitionDelayMs);

    return true;
  }

  finishSaveStatusError(requestId: number): boolean {
    if (requestId !== this.saveStatusRequestId) return false;

    this.clearSaveStatusTransitionTimer();
    this.setSaveStatus('idle');
    return true;
  }

  clearSaveStatus() {
    this.saveStatusRequestId += 1;
    this.clearSaveStatusTransitionTimer();
    this.setSaveStatus(null);
  }

  private clearSaveStatusTransitionTimer() {
    if (this.saveStatusTransitionTimer) {
      clearTimeout(this.saveStatusTransitionTimer);
      this.saveStatusTransitionTimer = null;
    }
  }

  private checkAutoEditButton(forceShow: boolean = false) {
    let currentRoute = this.router.routerState.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const { snapshot } = currentRoute;
    const { data } = snapshot;
    const params = snapshot.paramMap;
    const id = params.get('id');

    const isViewMode = data && data['mode'] === 'view';

    let hasEditPermission = false;

    if (data && data['codPrograma']) {
      //hasEditPermission = this.permissionService.hasRole(editRole);
    } else {
      hasEditPermission = false;
    }

    const shouldShow = id && (forceShow || (isViewMode && hasEditPermission));

    if (shouldShow) {
      this._showEditButton.set(true);
      this._editAction.set(() => {
        this.router.navigate(['../../edit', id], { relativeTo: currentRoute });
      });
    } else {
      this._showEditButton.set(false);
      this._editAction.set(null);
    }
  }
}
