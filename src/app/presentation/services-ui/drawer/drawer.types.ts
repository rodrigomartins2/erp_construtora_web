import { Type } from "@angular/core";

import { ButtonProp } from "../../components/@types/button.model";
import { DrawerContext } from "./drawer-context";
import { DrawerRef } from "./drawer-ref";

export enum DrawerSize {
    SM = "380px",
    MD = "500px",
    LG = "660px",
    XL = "960px",
    FULL = "100vw"
}

export type DrawerPosition = "left" | "right";
export type DrawerActionResult<TResult = unknown> = TResult | void | Promise<TResult | void>;

export interface DrawerContentComponent<TResult = unknown> {
    save?: () => DrawerActionResult<TResult>;
    beforeClosing?: () => void;
}

export interface DrawerActionContext<TComponent = unknown, TResult = unknown> {
    componentInstance: TComponent;
    context: DrawerContext;
    ref: DrawerRef<TResult>;
}

export interface DrawerFooterButton<TComponent = unknown, TResult = unknown> extends Omit<
    ButtonProp,
    "action" | "iconPos"
> {
    action?(context: DrawerActionContext<TComponent, TResult>): DrawerActionResult<TResult>;
    closeAfterAction?: boolean;
    iconPos?: "right" | "left";
}

export interface DrawerConfig<TData = unknown, TResult = unknown, TComponent = unknown> {
    title?: string;
    subtext?: string;
    icon?: string;
    width?: DrawerSize | string;
    position?: DrawerPosition;
    data?: TData;
    showFooter?: boolean;
    closeOnEscape?: boolean;
    closeOnBackdrop?: boolean;
    styleClass?: string;
    bodyClass?: string;
    footerButtons?: DrawerFooterButton<TComponent, TResult>[];
    saveButton?: Partial<DrawerFooterButton<TComponent, TResult>>;
    cancelButton?: Partial<DrawerFooterButton<TComponent, TResult>>;
    onSave?(context: DrawerActionContext<TComponent, TResult>): DrawerActionResult<TResult>;
    beforeClosing?(context: DrawerActionContext<TComponent, TResult>): void;
}

export interface DrawerOpenResult<TResult = unknown> {
    ref: DrawerRef<TResult>;
    context: DrawerContext;
}

export interface DrawerHostState<TData = unknown, TResult = unknown, TComponent = unknown> {
    component: Type<TComponent>;
    config: DrawerConfig<TData, TResult, TComponent>;
    context: DrawerContext;
    ref: DrawerRef<TResult>;
}
