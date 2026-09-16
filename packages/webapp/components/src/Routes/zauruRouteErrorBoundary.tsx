import { ErrorLayout } from "../Layouts/errorLayout/index.js";

export function zauruRouteErrorBoundary(from: string) {
  function ZauruRouteErrorBoundary() {
    return <ErrorLayout from={from} />;
  }
  ZauruRouteErrorBoundary.displayName = `ZauruRouteErrorBoundary(${from})`;
  return ZauruRouteErrorBoundary;
}
