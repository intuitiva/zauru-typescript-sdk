# zauru-typescript-sdk

Monorepo de paquetes del SDK de Zauru para TypeScript. Usa [**pnpm workspaces**](https://pnpm.io/workspaces) para instalar y enlazar dependencias, y [**Lerna**](https://lerna.js.org/) solo para **versionado y publicación** en npm (conventional commits y versión fija compartida, como antes).

## Requisitos

- **Node.js** 18+ (recomendado LTS; ver `engines` en el `package.json` de la raíz).
- **pnpm** 9 o superior. No fijamos una versión exacta en el repo: instala o activa **siempre la última** pnpm estable antes de instalar o publicar.

  Con [Corepack](https://nodejs.org/api/corepack.html) (recomendado):

  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```

  O con npm global:

  ```bash
  npm install -g pnpm@latest
  ```

## Instalación

En la raíz del repositorio:

```bash
pnpm install
```

## Compilar todos los paquetes

```bash
pnpm run build
```

Equivale a ejecutar el script `build` de cada paquete bajo `packages/webapp/*` en orden compatible con el grafo de dependencias.

Si prefieres seguir usando Lerna solo para el build:

```bash
npx lerna run build
```

(Lerna está configurado con `"npmClient": "pnpm"`, así que internamente usa pnpm.)

## Publicar en npm (versionado automático + publish)

El flujo sigue siendo el de siempre: **Lerna** lee los commits convencionales (`conventionalCommits` en `lerna.json`), calcula el siguiente número de versión **compartido** entre todos los paquetes del monorepo, actualiza los `package.json`, genera tags/commits según las opciones que elijas, y publica.

1. Autenticación en npm (una vez por máquina o CI):

   ```bash
   npm login
   ```

   O con token (por ejemplo en CI), sin guardar el token en un archivo versionado:

   ```bash
   npm config set //registry.npmjs.org/:_authToken "TU_TOKEN_AQUI"
   ```

2. Asegúrate de que el árbol de git está limpio y con los commits que quieres versionar (mensajes [Conventional Commits](https://www.conventionalcommits.org/) para que Lerna infiera `patch` / `minor` / `major`).

3. Compila:

   ```bash
   pnpm run build
   ```

4. Publica (interactivo por defecto):

   ```bash
   pnpm run publish:packages
   ```

   Es un alias de `lerna publish`. También puedes usar:

   ```bash
   npx lerna publish
   ```

Lerna te propondrá la nueva versión en función de los commits desde el último release. Si solo cambió un subconjunto de paquetes, puedes usar las opciones de Lerna (`--force-publish`, etc.) según tu política; el comportamiento por defecto es el mismo ecosistema que ya tenías con Yarn + Lerna.

## Añadir una nueva librería al monorepo

1. Crea una carpeta bajo `packages/webapp/<nombre-corto>/` (por ejemplo `packages/webapp/my-feature/`).

2. Añade un `package.json` con nombre bajo el scope **`@zauru-sdk/webapp-<nombre-corto>`** (npm solo permite una barra en el nombre: `@alcance/paquete`). Ejemplo:

   ```json
   {
     "name": "@zauru-sdk/webapp-my-feature",
     "version": "3.0.0",
     "private": false,
     "main": "./dist/esm/index.js",
     "module": "./dist/esm/index.js",
     "types": "./dist/index.d.ts",
     "type": "module",
     "publishConfig": { "access": "public" },
     "scripts": {
       "build": "npm run build:esm",
       "build:esm": "tsc -p tsconfig.esm.json"
     },
     "files": ["dist"]
   }
   ```

3. Declara en `dependencies` / `devDependencies` **todas** las dependencias que importes (pnpm no “adivina” dependencias transitivas como a veces hacía la instalación clásica con hoisting plano).

4. Referencia otros paquetes del monorepo con el mismo prefijo, por ejemplo `"@zauru-sdk/webapp-types": "workspace:^"` o `"^3.0.0"` alineado con la versión actual del monorepo.

5. No hace falta tocar `pnpm-workspace.yaml` si el paquete cae bajo el glob `packages/webapp/*`.

6. `pnpm install` y `pnpm run build` para comprobar que compila.

7. En el **primer** release del paquete nuevo, Lerna/npm deben poder crear el nombre en el scope `@zauru-sdk` (permisos de organización en npm). A partir de ahí, `pnpm run publish:packages` lo incluirá cuando haya cambios versionados.

## Enlazar paquetes localmente (desarrollo)

Desde la raíz, puedes enlazar un paquete concreto al global de pnpm:

```bash
pnpm --filter @zauru-sdk/webapp-config link --global
pnpm --filter @zauru-sdk/webapp-services link --global
# … repite para los que necesites
```

En el proyecto consumidor:

```bash
pnpm link @zauru-sdk/webapp-config @zauru-sdk/webapp-services
```

Para quitar enlaces:

```bash
pnpm unlink @zauru-sdk/webapp-config
```

(Alternativa: en el consumidor usa `workspace:` o rutas `file:../zauru-typescript-sdk/packages/webapp/...` solo para desarrollo local.)

## Notas sobre pnpm

- La configuración de workspaces está en [`pnpm-workspace.yaml`](pnpm-workspace.yaml).
- En la raíz hay un [`.npmrc`](.npmrc) con `public-hoist-pattern` para tipos (`@types/*`) y evitar choques de TypeScript con resoluciones duplicadas.
- Los tokens npm no deben versionarse: usa `.npmrc.local` (ignorado en git) si necesitas overrides privados en tu máquina.
