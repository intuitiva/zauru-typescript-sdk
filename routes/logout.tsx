import { createLogoutAction, createLogoutLoader } from "@zauru-sdk/utils";
import {
  ZauruLogoutPage,
  zauruRouteErrorBoundary,
} from "@zauru-sdk/components";

export const loader = createLogoutLoader();
export const action = createLogoutAction();
export const ErrorBoundary = zauruRouteErrorBoundary("/logout/index.tsx");

export default function Logout() {
  return <ZauruLogoutPage requireOnline={false} />;
}
