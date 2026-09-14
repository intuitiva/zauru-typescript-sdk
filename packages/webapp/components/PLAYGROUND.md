# Playground de `@zauru-sdk/components`

Taller visual de los componentes Remix/Tailwind de Zauru. Usa [Ladle](https://www.ladle.dev) (Vite + formato CSF) en lugar de Storybook: arranque más liviano para verificar UI en aislamiento. Las stories se pueden reusar si más adelante se pasa a Storybook.

## Requisitos

- Node >= 18
- pnpm >= 9
- Dependencias del monorepo instaladas (`pnpm install` en la raíz de `zauru-typescript-sdk`)

## Arrancar

Desde la raíz del SDK:

```bash
pnpm components:play
```

O desde este paquete:

```bash
pnpm --filter @zauru-sdk/components play
```

Abre [http://localhost:61000](http://localhost:61000). El menú a la izquierda lista las stories.

## Qué cubre

Stories en `stories/`:

- Button (colores, loading, disabled, dropdown)
- Container (header, colapsable)
- Form (TextField, SelectField, Checkbox, DatePicker, FileUpload, FormLayout, RadioButtonGroup)
- Tooltip / WithTooltip
- ProgressModal
- GenericDynamicTable y ZauruTable
- Títulos, StaticAlert, Card, Tabs

Los componentes atados a sesión Zauru (`HomeLayout`, `Zendesk`, `ValidateEmployeeAccess`) no tienen story: requieren la webapp host.

El playground envuelve cada story con:

- `react-hook-form` (`FormProvider`)
- Redux (store mínimo para `useAppSelector`)
- `MemoryRouter` de React Router 6 (el mismo que usa Remix 2) para `Link`, `Form` y `useSearchParams`

## Build estático

```bash
pnpm --filter @zauru-sdk/components play:build
```

Sale a `build/` (no se publica en npm). Para previsualizar: `pnpm --filter @zauru-sdk/components exec ladle preview`.

## Notas

- Tailwind se procesa solo para este playground (`tailwind.config.cjs` + `postcss.config.cjs`). Las webapps siguen usando su propio Tailwind.
- Las stories viven fuera de `src/` para que `tsc` no las compile al `dist` del paquete.
- Vite alias `@zauru-sdk/*` a los `src` de los paquetes hermanos (el `dist` ESM del monorepo no exporta named ESM que Vite pueda resolver).
