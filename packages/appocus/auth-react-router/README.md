# @appocus/auth-react-router

OAuth login plumbing for Appocus apps built on React Router 7 + `@zauru-sdk/webapp-services`.

## What's inside

- `authMiddleware`, `loginMiddleware`, `sessionRefreshMiddleware`
- `buildOAuthAuthorizeURL(requestUrl, { state })`
- `authenticatedFetch(input, init)` — `credentials: "include"` fetch that opens a popup on `401 { code: "UNAUTHORIZED" }` and retries once
- `requestReauthInPopup()` — promise-based popup orchestrator
- `createReauthConstants(appKey)` + `configureAuthRuntime({ reauthConstants, popupWindowName })`
- `AuthShellLayout`, `RedirectIfAuthenticated`
- Route module factories: `createLoginRoute`, `createLoginPopupRoute`, `createLogoutRoute`, `createCallbackRoute`, `createReauthPopupDoneRoute`

## Install

```bash
pnpm add @appocus/auth-react-router
```

Peer deps: `react`, `react-router`, `sonner`, `@zauru-sdk/webapp-services`, `@zauru-sdk/webapp-config`.

## Configure once

```ts
// app/root.tsx (or any client entry that runs early)
import {
  configureAuthRuntime,
  createReauthConstants,
} from "@appocus/auth-react-router";
import { appocusConfig } from "@/appocus.config";

configureAuthRuntime({
  reauthConstants: createReauthConstants("4pinos-agrocreditos"),
  popupWindowName: appocusConfig.oauth.reauthPopupWindowName,
});
```

## Wire routes

```tsx
// app/pages/login.tsx
import { createLoginRoute } from "@appocus/auth-react-router";
import { LoginForm } from "@appocus/ui";

const route = createLoginRoute({ LoginForm });

export const middleware = route.middleware;
export const action = route.action;
export default route.default;
```

For `/callback`, supply the `onSuccess` callback so domain-specific persistence
(employees, agencies, …) stays in your app:

```tsx
// app/pages/callback.tsx
import { createCallbackRoute } from "@appocus/auth-react-router";
import { LoginForm } from "@appocus/ui";
import { EmployeesRepository } from "@/db/employees/repository.server";
import { UsersRepository } from "@/db/users/repository.server";

const route = createCallbackRoute({
  LoginForm,
  async onSuccess({ session }) {
    const employeeId = Number(session.get("employee_id"));
    const selectedEntity = Number(session.get("selected_entity"));
    const userName = String(session.get("name") ?? "Usuario");
    const userEmail = String(session.get("username") ?? "usuario@example.com");

    const employee = await EmployeesRepository.getById(employeeId);
    const agencyId = employee?.agency_id ?? null;
    if (!agencyId) {
      return {
        error:
          "No se pudo determinar la agencia del empleado. Contacta al administrador.",
      };
    }

    await UsersRepository.upsertFromLogin({
      employee_id: employeeId,
      agency_id: agencyId,
      selected_entity: selectedEntity,
      name: userName,
      email: userEmail,
    });

    return {
      queryParams: new URLSearchParams({
        name: userName,
        email: userEmail,
        employee_id: String(employeeId),
        agency_id: String(agencyId),
        selected_entity: String(selectedEntity),
      }),
    };
  },
});

export const middleware = route.middleware;
export const action = route.action;
export default route.default;
```

## Authenticated client fetch

```ts
import { authenticatedFetch } from "@appocus/auth-react-router";

const res = await authenticatedFetch("/api/things");
```
