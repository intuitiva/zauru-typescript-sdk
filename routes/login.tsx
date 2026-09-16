import {
  createLoginAction,
  createLoginLoader,
} from "@zauru-sdk/utils";
import {
  ZauruLoginPage,
  zauruRouteErrorBoundary,
} from "@zauru-sdk/components";

export const loader = createLoginLoader();
export const action = createLoginAction();
export const ErrorBoundary = zauruRouteErrorBoundary("/login/index.tsx");

export default function Login() {
  return <ZauruLoginPage />;
}
