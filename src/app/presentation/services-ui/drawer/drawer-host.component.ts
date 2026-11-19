import { NgClass } from "@angular/common";
import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    ElementRef,
    computed,
    EnvironmentInjector,
    inject,
    Injector,
    signal,
    Type,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { SkeletonModule } from "primeng/skeleton";

import { ButtonProp } from "../../components/@types/button.model";
import { DRAWER_CONFIG, DRAWER_CONTEXT, DRAWER_DATA, DRAWER_REF } from "./drawer.tokens";
import {
    DrawerActionContext,
    DrawerConfig,
    DrawerContentComponent,
    DrawerFooterButton,
    DrawerHostState,
    DrawerSize
} from "./drawer.types";
import { DrawerContext } from "./drawer-context";
import { DrawerCloseReason, DrawerRef } from "./drawer-ref";

const CANCEL_BUTTON_KEY = "drawer-cancel";
const SAVE_BUTTON_KEY = "drawer-save";

@Component({
    selector: "app-drawer-host",
    imports: [NgClass, ButtonModule, SkeletonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (state(); as drawerState) {
            <div class="fixed inset-0 z-1005">
                <button
                    type="button"
                    class="absolute inset-0 size-full cursor-default border-0 bg-slate-950/45 p-0 transition-opacity duration-200"
                    [class.opacity-100]="visible()"
                    [class.opacity-0]="!visible()"
                    aria-label="Fechar drawer"
                    (click)="closeFromBackdrop()"
                ></button>

                <aside
                    #drawerPanel
                    class="app-drawer-panel absolute top-0 flex h-dvh max-w-full flex-col overflow-hidden border-0 bg-white shadow-2xl transition-transform duration-200"
                    [class.right-0]="position() === 'right'"
                    [class.left-0]="position() === 'left'"
                    [class.translate-x-0]="visible()"
                    [class.translate-x-full]="position() === 'right' && !visible()"
                    [class.-translate-x-full]="position() === 'left' && !visible()"
                    [class.app-drawer-panel-hidden-mobile]="!visible()"
                    [ngClass]="drawerState.config.styleClass ?? ''"
                    [style.width]="width()"
                    role="dialog"
                    aria-modal="true"
                >
                    <header
                        class="flex min-h-20 shrink-0 items-start justify-between gap-4 border-0 border-b border-solid border-slate-200 px-6 py-5"
                        (touchstart)="onTouchStart($event)"
                        (touchmove)="onTouchMove($event)"
                        (touchend)="onTouchEnd()"
                    >
                        <div class="flex min-w-0 flex-1 items-start gap-3">
                            @if (drawerState.context.icon()) {
                                <i
                                    [ngClass]="drawerState.context.icon()"
                                    class="mt-1 shrink-0 text-xl leading-5 text-slate-700"
                                ></i>
                            }

                            <div class="min-w-0 flex-1">
                                <h2 class="m-0 wrap-break-word text-xl font-semibold leading-7 text-slate-700">
                                    {{ drawerState.context.title() }}
                                </h2>

                                @if (drawerState.context.subtext()) {
                                    <p class="m-0 mt-1 wrap-break-word text-sm font-medium leading-5 text-slate-500">
                                        {{ drawerState.context.subtext() }}
                                    </p>
                                }
                            </div>
                        </div>

                        <p-button
                            icon="pi pi-times"
                            [rounded]="true"
                            [text]="true"
                            severity="secondary"
                            size="small"
                            title="Fechar"
                            (onClick)="close()"
                        />
                    </header>

                    <section
                        class="min-h-0 flex-1 overflow-y-auto px-6 py-5"
                        [ngClass]="drawerState.config.bodyClass ?? ''"
                    >
                        <ng-container #contentContainer />
                    </section>

                    @if (drawerState.context.showFooter() && drawerState.context.footerButtons().length > 0) {
                        <footer class="shrink-0 border-0 border-t border-solid border-slate-200 bg-white px-6 py-4">
                            <div class="flex flex-row gap-2 sm:justify-end">
                                @for (button of drawerState.context.footerButtons(); track button.key ?? button.label) {
                                    @if (button.loading) {
                                        <div [class]="resolveButtonHostClass(button)" aria-busy="true">
                                            <p-skeleton width="9rem" height="2.25rem" borderRadius="8px" />
                                        </div>
                                    } @else {
                                    <p-button
                                        [icon]="button.icon"
                                        [label]="button.label"
                                        [outlined]="button.outlined"
                                        [rounded]="button.rounded"
                                        [iconPos]="button.iconPos ?? 'left'"
                                        [title]="button.altText || button.label"
                                        [disabled]="button.disable || button.loading"
                                        [severity]="button.severity"
                                        [text]="button.text"
                                        [class]="resolveButtonHostClass(button)"
                                        [styleClass]="resolveButtonStyleClass(button)"
                                        (onClick)="handleFooterButton(button.key)"
                                    />
                                    }
                                }
                            </div>
                        </footer>
                    }
                </aside>
            </div>
        }
    `,
    styles: [`
        @media (max-width: 640px) {
            .app-drawer-panel {
                top: auto !important;
                right: 0 !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
                height: var(--app-mobile-sheet-height, auto) !important;
                max-height: 92dvh !important;
                border-radius: 1.5rem 1.5rem 0 0 !important;
                background: #F5F8FC !important;
                box-shadow:
                    0 -10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 -8px 10px -6px rgba(0, 0, 0, 0.1) !important;
                transform: translateY(0) !important;
                transition: transform 0.24s ease-out !important;
            }

            .app-drawer-panel-hidden-mobile {
                transform: translateY(100%) !important;
            }

            .app-drawer-panel header,
            .app-drawer-panel section,
            .app-drawer-panel footer {
                background: #F5F8FC !important;
            }

            .app-drawer-panel header {
                position: relative;
                border-radius: 1.5rem 1.5rem 0 0;
                padding-top: 1.5rem;
                cursor: grab;
                touch-action: none;
                user-select: none;
            }

            .app-drawer-panel header:active {
                cursor: grabbing;
            }

            .app-drawer-panel header::before {
                content: "";
                position: absolute;
                top: 0.75rem;
                left: 50%;
                width: 3rem;
                height: 0.35rem;
                border-radius: 999px;
                background-color: #e2e8f0;
                transform: translateX(-50%);
            }
        }
    `]
})
export class DrawerHostComponent {
    @ViewChild("contentContainer", { read: ViewContainerRef }) contentContainer?: ViewContainerRef;

    @ViewChild("drawerPanel", { read: ElementRef }) drawerPanel?: ElementRef<HTMLElement>;

    readonly state = signal<DrawerHostState | null>(null);

    readonly visible = signal(false);

    readonly width = computed(() => this.state()?.config.width ?? DrawerSize.MD);

    readonly position = computed(() => this.state()?.config.position ?? "right");

    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    private readonly messageService = inject(MessageService);

    private readonly injector = inject(Injector);

    private readonly environmentInjector = inject(EnvironmentInjector);

    private contentRef?: ComponentRef<unknown>;

    private touchStartY: number | null = null;

    private touchCurrentY: number | null = null;

    private touchStartHeight = 0;

    private readonly closeDragThreshold = 80;

    private readonly expandDragThreshold = 48;

    open<TData, TResult, TComponent>(
        component: Type<TComponent>,
        config: DrawerConfig<TData, TResult, TComponent>,
        context: DrawerContext,
        ref: DrawerRef<TResult>
    ): void {
        this.state.set({ component, config, context, ref });
        context.footerButtons.set(this.resolveFooterButtons(config, ref));
        this.changeDetectorRef.detectChanges();
        this.renderContent(component, config, context, ref);
        this.clearDrawerHeight();
        this.visible.set(true);
        this.changeDetectorRef.detectChanges();
    }

    close(reason: DrawerCloseReason = "close"): void {
        const drawerState = this.state();
        const componentInstance = this.contentRef?.instance;

        if (!drawerState) {
            return;
        }

        if (!componentInstance) {
            drawerState.ref.close(undefined, reason);
            return;
        }

        this.runBeforeClosing(drawerState, componentInstance, reason);
    }

    closeFromBackdrop(): void {
        const drawerState = this.state();

        if (!drawerState || drawerState.config.closeOnBackdrop === false) {
            return;
        }

        this.close("backdrop");
    }

    onTouchStart(event: TouchEvent): void {
        if (!this.isMobileViewport()) {
            return;
        }

        this.touchStartY = event.touches[0]?.clientY ?? null;
        this.touchCurrentY = this.touchStartY;
        this.touchStartHeight = this.getDrawerHeight();
    }

    onTouchMove(event: TouchEvent): void {
        if (!this.isMobileViewport()) {
            return;
        }

        this.touchCurrentY = event.touches[0]?.clientY ?? this.touchCurrentY;

        if (this.touchStartY === null || this.touchCurrentY === null) {
            return;
        }

        event.preventDefault();

        const deltaY = this.touchCurrentY - this.touchStartY;
        this.setDrawerHeight(this.clampDrawerHeight(this.touchStartHeight - deltaY));
    }

    onTouchEnd(): void {
        if (!this.isMobileViewport()) {
            this.resetTouch();
            return;
        }

        if (this.touchStartY === null || this.touchCurrentY === null) {
            this.resetTouch();
            return;
        }

        const deltaY = this.touchCurrentY - this.touchStartY;

        if (deltaY > this.closeDragThreshold) {
            this.close();
        } else if (deltaY < -this.expandDragThreshold) {
            this.setDrawerHeight(window.innerHeight * 0.92);
        } else {
            this.clearDrawerHeight();
        }

        this.resetTouch();
    }

    handleFooterButton(key: string | undefined): void {
        const drawerState = this.state();
        const componentInstance = this.contentRef?.instance;

        if (!drawerState || !key) {
            return;
        }

        const button = drawerState.config.footerButtons?.find(footerButton => footerButton.key === key);

        if (key === CANCEL_BUTTON_KEY) {
            drawerState.ref.close(undefined, "cancel");
            return;
        }

        if (!componentInstance) {
            return;
        }

        if (button?.action) {
            this.runCustomAction(button, drawerState, componentInstance);
            return;
        }

        if (key === SAVE_BUTTON_KEY) {
            this.save(drawerState, componentInstance);
        }
    }

    resolveButtonStyleClass(button: ButtonProp): string | undefined {
        return ["w-full", button.className].filter(Boolean).join(" ");
    }

    resolveButtonHostClass(button: ButtonProp): string {
        return ["min-w-0 flex-1 sm:flex-none", button.className].filter(Boolean).join(" ");
    }

    hide(): void {
        this.visible.set(false);
    }

    destroyContent(): void {
        this.contentRef?.destroy();
        this.contentRef = undefined;
    }

    private getDrawerHeight(): number {
        return this.drawerPanel?.nativeElement.getBoundingClientRect().height ?? window.innerHeight * 0.8;
    }

    private setDrawerHeight(height: number): void {
        this.drawerPanel?.nativeElement.style.setProperty("--app-mobile-sheet-height", `${height}px`);
    }

    private clearDrawerHeight(): void {
        this.drawerPanel?.nativeElement.style.removeProperty("--app-mobile-sheet-height");
    }

    private clampDrawerHeight(height: number): number {
        const minHeight = window.innerHeight * 0.42;
        const maxHeight = window.innerHeight * 0.92;

        return Math.min(Math.max(height, minHeight), maxHeight);
    }

    private resetTouch(): void {
        this.touchStartY = null;
        this.touchCurrentY = null;
        this.touchStartHeight = 0;
    }

    private isMobileViewport(): boolean {
        return window.innerWidth <= 640;
    }

    private renderContent<TData, TResult, TComponent>(
        component: Type<TComponent>,
        config: DrawerConfig<TData, TResult, TComponent>,
        context: DrawerContext,
        ref: DrawerRef<TResult>
    ): void {
        if (!this.contentContainer) {
            return;
        }

        this.contentContainer.clear();
        const childInjector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: DRAWER_DATA, useValue: config.data },
                { provide: DRAWER_CONFIG, useValue: config },
                { provide: DRAWER_CONTEXT, useValue: context },
                { provide: DRAWER_REF, useValue: ref }
            ]
        });

        this.contentRef = this.contentContainer.createComponent(component, {
            injector: childInjector,
            environmentInjector: this.environmentInjector
        });
    }

    private resolveFooterButtons<TData, TResult, TComponent>(
        config: DrawerConfig<TData, TResult, TComponent>,
        ref: DrawerRef<TResult>
    ): ButtonProp[] {
        if (config.showFooter === false) {
            return [];
        }

        if (config.footerButtons?.length) {
            return config.footerButtons.map(button =>
                this.toButtonProp(button, () => this.handleFooterButton(button.key))
            );
        }

        return [
            this.toButtonProp(
                {
                    key: CANCEL_BUTTON_KEY,
                    label: "Cancelar",
                    icon: "pi pi-times",
                    severity: "secondary",
                    outlined: true,
                    ...config.cancelButton
                },
                () => ref.close(undefined, "cancel")
            ),
            this.toButtonProp(
                {
                    key: SAVE_BUTTON_KEY,
                    label: "Salvar",
                    icon: "pi pi-check",
                    severity: "primary",
                    ...config.saveButton
                },
                () => this.handleFooterButton(SAVE_BUTTON_KEY)
            )
        ];
    }

    private toButtonProp<TComponent, TResult>(
        button: DrawerFooterButton<TComponent, TResult>,
        action: () => void
    ): ButtonProp {
        const { action: _contextAction, closeAfterAction: _closeAfterAction, ...buttonProps } = button;

        return {
            action,
            iconPos: buttonProps.iconPos ?? "left",
            showIf: buttonProps.showIf ?? true,
            ...buttonProps
        };
    }

    private async runCustomAction<TResult>(
        button: DrawerFooterButton<unknown, TResult>,
        drawerState: DrawerHostState<unknown, TResult, unknown>,
        componentInstance: unknown
    ): Promise<void> {
        try {
            const actionContext = this.createActionContext(drawerState, componentInstance);
            const result = await button.action?.(actionContext);

            if (button.closeAfterAction) {
                drawerState.ref.close(result as TResult | undefined, "close");
            }
        } catch (error) {
            this.showErrorToast("Erro ao executar ação", error);
        }
    }

    private async save<TResult>(
        drawerState: DrawerHostState<unknown, TResult, unknown>,
        componentInstance: unknown
    ): Promise<void> {
        const { context } = drawerState;

        if (context.saving()) {
            return;
        }

        context.saving.set(true);
        context.setButtonLoading(SAVE_BUTTON_KEY, true);
        context.setButtonDisabled(CANCEL_BUTTON_KEY, true);

        try {
            const actionContext = this.createActionContext(drawerState, componentInstance);
            const result = drawerState.config.onSave
                ? await drawerState.config.onSave(actionContext)
                : await (componentInstance as DrawerContentComponent<TResult>).save?.();

            drawerState.ref.close(result as TResult | undefined, "save");
        } catch (error) {
            this.showErrorToast("Erro ao salvar", error);
        } finally {
            context.saving.set(false);
            context.setButtonLoading(SAVE_BUTTON_KEY, false);
            context.setButtonDisabled(CANCEL_BUTTON_KEY, false);
        }
    }

    private runBeforeClosing<TResult>(
        drawerState: DrawerHostState<unknown, TResult, unknown>,
        componentInstance: unknown,
        reason: DrawerCloseReason
    ): void {
        const componentWithClose = componentInstance as DrawerContentComponent<TResult>;

        if (drawerState.config.beforeClosing) {
            drawerState.config.beforeClosing(this.createActionContext(drawerState, componentInstance));
            return;
        }

        if (componentWithClose.beforeClosing) {
            componentWithClose.beforeClosing();
            return;
        }

        drawerState.ref.close(undefined, reason);
    }

    private createActionContext<TResult>(
        drawerState: DrawerHostState<unknown, TResult, unknown>,
        componentInstance: unknown
    ): DrawerActionContext<unknown, TResult> {
        return {
            componentInstance,
            context: drawerState.context,
            ref: drawerState.ref
        };
    }

    private showErrorToast(summary: string, error: unknown): void {
        const severity = (error as { severity?: string })?.severity || "error";
        const title = severity === "warn" ? "Aviso" : summary;

        this.messageService.add({
            severity,
            summary: title,
            detail: this.resolveErrorMessage(error)
        });
    }

    private resolveErrorMessage(error: unknown): string {
        if (error instanceof Error && error.message) {
            return error.message;
        }

        return "Não foi possível salvar as alterações. Revise os dados e tente novamente.";
    }
}
