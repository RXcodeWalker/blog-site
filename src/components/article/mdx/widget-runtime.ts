// RUNTIME-ONLY: imported only by InteractiveWidget. No metadata — zero docs payload shipped.
import { lazy } from "react";
import type { LazyExoticComponent, ComponentType } from "react";

export const WIDGET_RUNTIME: Record<string, LazyExoticComponent<ComponentType<Record<string, unknown>>>> = {
  CounterDemo: lazy(() => import("./widgets/CounterDemo") as Promise<{ default: ComponentType<Record<string, unknown>> }>),
};
