import { InjectionToken } from "@angular/core";

import { DrawerConfig } from "./drawer.types";
import { DrawerContext } from "./drawer-context";
import { DrawerRef } from "./drawer-ref";

export const DRAWER_DATA = new InjectionToken<unknown>("DRAWER_DATA");
export const DRAWER_CONFIG = new InjectionToken<DrawerConfig>("DRAWER_CONFIG");
export const DRAWER_CONTEXT = new InjectionToken<DrawerContext>("DRAWER_CONTEXT");
export const DRAWER_REF = new InjectionToken<DrawerRef>("DRAWER_REF");
