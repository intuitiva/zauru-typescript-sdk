# @appocus/ui

Shadcn-style React component library shipped as **TypeScript-compiled .js + .d.ts**. Includes the 29 primitives (button, card, dialog, dropdown-menu, sidebar, …), a Tailwind-friendly `cn` helper, a `ThemeProvider` and `ThemedToaster` wired to `next-themes`, plus composed pieces (`LoginForm`, `NotFoundPage`) that read branding from `@appocus/config`.

## Install

```bash
pnpm add @appocus/ui @appocus/config
```

Peer deps (resolved by the host app): `react`, `react-dom`, `react-router`, `next-themes`, `sonner`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `radix-ui`, and the individual `@radix-ui/react-*` primitives. See `package.json` for the exact list.

## Tailwind v4 setup

This library publishes only its source as compiled JavaScript — it does not ship a CSS bundle. To make Tailwind v4 pick up the classes used by the primitives, add a `@source` directive to your app's main stylesheet:

```css
/* app/app.css */
@import "tailwindcss";

@source "../node_modules/@appocus/ui/dist/esm/**/*.js";
```

Adjust the relative path to match where your CSS lives.

## Usage

```tsx
import { Button, Card, ThemeProvider, ThemedToaster, LoginForm } from "@appocus/ui";
import { AppocusConfigProvider } from "@appocus/config";
import { appocusConfig } from "@/appocus.config";

export default function Root({ children }) {
  return (
    <ThemeProvider>
      <AppocusConfigProvider value={appocusConfig}>
        {children}
        <ThemedToaster />
      </AppocusConfigProvider>
    </ThemeProvider>
  );
}
```

`LoginForm` and `NotFoundPage` automatically consume the active config (logo, hero image, copy, support mailto).

## What's not here

`AppSidebar`, `DashboardHome`, navigation menus, and anything that depends on per-app permissions or domain repositories stay in each app — they're too coupled to the product to share.
