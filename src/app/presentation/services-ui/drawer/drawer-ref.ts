import { signal } from "@angular/core";

export type DrawerCloseReason = "close" | "cancel" | "save" | "backdrop" | "escape" | "browser-back";

export class DrawerRef<TResult = unknown> {
    readonly closed = signal(false);

    readonly closeReason = signal<DrawerCloseReason | null>(null);

    readonly result = signal<TResult | undefined>(undefined);

    private closeHandler?: (result: unknown, reason: DrawerCloseReason) => void;

    close(result?: TResult, reason: DrawerCloseReason = "close"): void {
        if (this.closed()) {
            return;
        }

        this.result.set(result);
        this.closeReason.set(reason);
        this.closed.set(true);
        this.closeHandler?.(result, reason);
    }

    setCloseHandler(handler: (result: unknown, reason: DrawerCloseReason) => void): void {
        this.closeHandler = handler;
    }
}
