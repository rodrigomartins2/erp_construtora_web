import { DOCUMENT } from "@angular/common";
import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    EnvironmentInjector,
    inject,
    Injectable,
    OnDestroy,
    Type
} from "@angular/core";

import { DrawerConfig, DrawerOpenResult } from "./drawer.types";
import { DrawerContext } from "./drawer-context";
import { DrawerHostComponent } from "./drawer-host.component";
import { DrawerCloseReason, DrawerRef } from "./drawer-ref";

interface DrawerStackItem<TResult = unknown> {
    hostRef: ComponentRef<DrawerHostComponent>;
    ref: DrawerRef<TResult>;
    closeOnEscape: boolean;
}

@Injectable({
    providedIn: "root"
})
export class DrawerService implements OnDestroy {
    private readonly applicationRef = inject(ApplicationRef);

    private readonly document = inject(DOCUMENT);

    private readonly environmentInjector = inject(EnvironmentInjector);

    private drawerStack: DrawerStackItem[] = [];

    private originalBodyOverflow: string | null = null;

    private originalDocumentOverflow: string | null = null;

    open<
        TData = unknown,
        TResult = unknown,
        TComponent = unknown
    >(component: Type<TComponent>, config: DrawerConfig<TData, TResult, TComponent> = {}): DrawerOpenResult<TResult> {
        const context = this.createContext(config);
        const ref = new DrawerRef<TResult>();
        const hostRef = createComponent(DrawerHostComponent, {
            environmentInjector: this.environmentInjector
        });

        ref.setCloseHandler((_result, reason) => this.closeDrawer(hostRef, ref, reason));
        this.applicationRef.attachView(hostRef.hostView);
        this.document.body.appendChild(hostRef.location.nativeElement);
        hostRef.instance.open(component, config, context, ref);

        this.drawerStack.push({
            hostRef,
            ref,
            closeOnEscape: config.closeOnEscape !== false
        });
        this.lockPageScroll();

        if (this.drawerStack.length === 1) {
            this.document.addEventListener("keydown", this.handleKeyDown, true);
        }

        return { ref, context };
    }

    private createContext<TData, TResult, TComponent>(
        config: DrawerConfig<TData, TResult, TComponent>
    ): DrawerContext {
        const context = new DrawerContext();

        if (config.title) context.title.set(config.title);
        if (config.subtext) context.subtext.set(config.subtext);
        if (config.icon) context.icon.set(config.icon);
        if (config.showFooter !== undefined) context.showFooter.set(config.showFooter);

        return context;
    }

    private handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape") {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const topDrawer = this.drawerStack[this.drawerStack.length - 1];

        if (!topDrawer || topDrawer.closeOnEscape === false) {
            return;
        }

        topDrawer.hostRef.instance.close("escape");
    };

    private closeDrawer<TResult>(
        hostRef: ComponentRef<DrawerHostComponent>,
        ref: DrawerRef<TResult>,
        _reason: DrawerCloseReason
    ): void {
        hostRef.instance.hide();
        this.drawerStack = this.drawerStack.filter(item => item.ref !== ref);

        window.setTimeout(() => {
            hostRef.instance.destroyContent();
            this.applicationRef.detachView(hostRef.hostView);
            hostRef.destroy();
        }, 200);

        if (this.drawerStack.length === 0) {
            this.unlockPageScroll();
            this.document.removeEventListener("keydown", this.handleKeyDown, true);
        }
    }

    ngOnDestroy(): void {
        this.document.removeEventListener("keydown", this.handleKeyDown, true);

        this.drawerStack.forEach(item => {
            item.hostRef.instance.destroyContent();
            this.applicationRef.detachView(item.hostRef.hostView);
            item.hostRef.destroy();
        });
        this.drawerStack = [];
        this.unlockPageScroll();
    }

    private lockPageScroll(): void {
        if (this.drawerStack.length !== 1) {
            return;
        }

        this.originalBodyOverflow = this.document.body.style.overflow;
        this.originalDocumentOverflow = this.document.documentElement.style.overflow;
        this.document.body.style.overflow = "hidden";
        this.document.documentElement.style.overflow = "hidden";
    }

    private unlockPageScroll(): void {
        if (this.originalBodyOverflow === null || this.originalDocumentOverflow === null) {
            return;
        }

        this.document.body.style.overflow = this.originalBodyOverflow;
        this.document.documentElement.style.overflow = this.originalDocumentOverflow;
        this.originalBodyOverflow = null;
        this.originalDocumentOverflow = null;
    }
}
