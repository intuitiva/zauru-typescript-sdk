import type * as React from "react";

/**
 * Loose component contract every Appocus app's `LoginForm` is expected to
 * implement. Keeps the auth route factories independent from `@appocus/ui`.
 */
export type LoginFormProps = {
  isLoading?: boolean;
  mode?: "login" | "logout";
  title?: string;
  loadingText?: string;
  buttonText?: string;
};

export type LoginFormComponent = React.ComponentType<LoginFormProps>;

export type RouteMiddlewareFn = (args: {
  request: Request;
}) => Promise<unknown> | unknown;

export type RouteActionFn<T = unknown> = (args: {
  request: Request;
}) => Promise<T>;

export type RouteLoaderFn<T = unknown> = (args: {
  request: Request;
}) => Promise<T>;

export type RouteModule<TActionData = unknown> = {
  middleware?: RouteMiddlewareFn[];
  action?: RouteActionFn<TActionData>;
  loader?: RouteLoaderFn;
  default: React.ComponentType<{ actionData?: TActionData }>;
};
