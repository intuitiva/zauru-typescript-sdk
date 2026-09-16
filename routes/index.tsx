import { createIndexLoader } from "@zauru-sdk/utils";
import { ZauruIndexPage, zauruRouteErrorBoundary } from "@zauru-sdk/components";

export const loader = createIndexLoader();
export const ErrorBoundary = zauruRouteErrorBoundary("/index.tsx");

export default function Index() {
  return <ZauruIndexPage title="Mi webapp" />;
}
