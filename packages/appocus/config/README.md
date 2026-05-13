# @appocus/config

Shared TypeScript types and a small React context for per-app Appocus configuration: branding, assets, OAuth metadata, PWA fields, login copy, and the universal 404 strings.

## Install

```bash
pnpm add @appocus/config
```

## Usage

Define your app's config by extending `BaseAppocusConfig`:

```ts
import { defineAppocusConfig, type BaseAppocusConfig } from "@appocus/config";

export type AppocusConfig = BaseAppocusConfig & {
  copy: BaseAppocusConfig["copy"] & {
    // app-specific copy
    invoice: { addLineItemButton: string; /* ... */ };
  };
  formatLineItemFallbackLabel: (id: number) => string;
};

export const appocusConfig: AppocusConfig = defineAppocusConfig({
  app: { title: "My App", /* ... */ },
  // ...
});
```

Wrap your tree:

```tsx
import { AppocusConfigProvider } from "@appocus/config";
import { appocusConfig } from "./appocus.config";

<AppocusConfigProvider value={appocusConfig}>
  <App />
</AppocusConfigProvider>
```

Consume it (parameterise the hook with your extended type):

```ts
import { useAppocusConfig } from "@appocus/config";
import type { AppocusConfig } from "./appocus.config";

const cfg = useAppocusConfig<AppocusConfig>();
```

A common pattern is to re-export a project-specific hook so callers don't repeat the generic:

```ts
// app/contexts/appocus-config-context.ts
import { useAppocusConfig as base } from "@appocus/config";
import type { AppocusConfig } from "@/appocus.config";

export const useAppocusConfig = () => base<AppocusConfig>();
```

## Scope

This package only provides types and a context. It does not include UI primitives, auth helpers, or database utilities; see `@appocus/ui`, `@appocus/auth-react-router`, and `@appocus/tanstack-db`.
