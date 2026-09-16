import { createSessionGuardLoader } from "@zauru-sdk/utils";
import { ZauruHomePage, zauruRouteErrorBoundary } from "@zauru-sdk/components";

export const loader = createSessionGuardLoader();
export const ErrorBoundary = zauruRouteErrorBoundary("/home/index.tsx");

export default function Home() {
  return <ZauruHomePage title="Mi webapp" />;
}
