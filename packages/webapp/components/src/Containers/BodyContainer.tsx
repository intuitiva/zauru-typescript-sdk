import React from "react";
import { useZauruClientErrorReporting } from "../observability/useZauruClientErrorReporting.js";

type Props = {
  children: React.ReactNode;
  appVersion?: string;
  /** Default true. Captures window.onerror / unhandledrejection. */
  reportClientErrors?: boolean;
};

export const BodyContainer = (props: Props) => {
  const { children, appVersion, reportClientErrors = true } = props;
  useZauruClientErrorReporting({
    appVersion,
    enabled: reportClientErrors,
  });
  return <body className="flex flex-col min-h-screen m-0">{children}</body>;
};
