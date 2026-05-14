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

**Lerna** usa commits [Conventional Commits](https://www.conventionalcommits.org/) (`lerna.json`) y mantiene una **versión fija compartida** en todos los paquetes bajo `packages/webapp/*`.

### 1. Autenticación

npm y pnpm leen credenciales sobre todo de **`~/.npmrc`**. Comprueba:

```bash
npm whoami
npm config get registry
```

Debe salir tu usuario y `https://registry.npmjs.org/`. Si en `~/.npmrc` tienes otro `registry` o `@zauru-sdk:registry` (mirror corporativo, Verdaccio, etc.), el **PUT de publicación puede responder `E404`**. Este repo fuerza en [`.npmrc`](.npmrc) el registry público para `@zauru-sdk`; aun así conviene revisar el `~/.npmrc` global.

Token (CI o local):

```bash
npm config set //registry.npmjs.org/:_authToken "TU_TOKEN_AQUI"
```

**Nota:** el archivo **`.npmrc.local`** no lo lee npm por defecto. Si solo ahí tienes el token, cópialo a `~/.npmrc` o usa la variable de entorno estándar en CI:

```bash
export NPM_TOKEN=npm_xxxxxxxx
npm config set //registry.npmjs.org/:_authToken "${NPM_TOKEN}"
```

Si tu cuenta tiene **2FA** en escritura, puede hacer falta `--otp=123456` en el comando de publicación (o un token de automatización con permiso de publicación en npmjs).

### 2. Build

```bash
pnpm run build
```

### 3. Comandos de publicación (Lerna)

El script `pnpm run publish:packages` equivale a:

`lerna publish --registry https://registry.npmjs.org/ --no-verify-access`

(`--no-verify-access` evita falsos positivos en la comprobación de acceso; el registry explícito evita publicar contra un host equivocado.)

Puedes añadir **argumentos de Lerna** después de `--`. Ejemplos (en zsh, quoted el `'*'`):

| Objetivo | Comando |
|----------|---------|
| Subir **solo patch** (p. ej. `5.0.0` → `5.0.1`) según commits | `pnpm run publish:packages -- patch` |
| Subir **minor** (`5.0.x` → `5.1.0`) | `pnpm run publish:packages -- minor` |
| Subir **major** (`5.x.x` → `6.0.0`) | `pnpm run publish:packages -- major` |
| **Forzar** bump patch aunque Lerna no vea cambios (HEAD ya etiquetado) | `pnpm run publish:packages -- patch --force-publish '*'` |
| **Número exacto** para todos los paquetes | `pnpm run publish:packages -- 5.0.2` |
| **Prepatch** / prerelease (`5.0.0` → `5.0.1-alpha.0`, etc.) | `pnpm run publish:packages -- prepatch` o `prerelease` |
| **Reintentar** subir lo que ya está en los `package.json` **sin** nuevo bump | `pnpm run publish:packages -- from-package` |
| OTP en la misma línea | `pnpm run publish:packages -- patch --otp=123456` |

También puedes usar `npx lerna publish ...` con los mismos argumentos.

Si Lerna dice **«Current HEAD is already released»** y no quieres otro bump, usa **`from-package`** para subir a npm la versión que ya tienes en disco.

### 4. Alternativa: solo versionar con Lerna y publicar con pnpm

Si `lerna publish` sigue fallando en el paso de `pnpm publish`, separa pasos:

```bash
npx lerna version patch --force-publish '*' --yes
pnpm run publish:recursive
```

`publish:recursive` ejecuta `pnpm -r publish` con `--access public` y el registry npmjs (reescribe `workspace:^` en los tarballs).

### 5. Dependencias internas (`workspace:^`)

Las dependencias **entre** paquetes `@zauru-sdk/*` deben ser **`workspace:^`**. Así el `pnpm install --lockfile-only` que hace Lerna no intenta resolver en npm una versión que aún no existe (`ERR_PNPM_NO_MATCHING_VERSION`).

**Importante:** al ejecutar **`lerna version`** o **`lerna publish`**, Lerna a veces **reescribe** esas entradas a rangos tipo `^5.0.1`. Si tras un versionado ves errores de `No matching version found for @zauru-sdk/…` al hacer `pnpm install`, vuelve a dejar el protocolo workspace y reinstala:

```bash
pnpm run sync:workspace-protocol
pnpm install
```

## Añadir una nueva librería al monorepo

1. Crea una carpeta bajo `packages/webapp/<nombre-corto>/` (por ejemplo `packages/webapp/my-feature/`).

2. Añade un `package.json` con nombre bajo el scope **`@zauru-sdk/<nombre-corto>`** (npm solo permite una barra en el nombre: `@alcance/paquete`). Ejemplo:

   ```json
   {
     "name": "@zauru-sdk/my-feature",
     "version": "3.0.0",
     "private": false,
     "main": "./dist/esm/index.js",
     "module": "./dist/esm/index.js",
     "types": "./dist/index.d.ts",
     "type": "module",
     "publishConfig": {
       "access": "public",
       "registry": "https://registry.npmjs.org/"
     },
     "scripts": {
       "build": "npm run build:esm",
       "build:esm": "tsc -p tsconfig.esm.json"
     },
     "files": ["dist"]
   }
   ```

3. Declara en `dependencies` / `devDependencies` **todas** las dependencias que importes (pnpm no “adivina” dependencias transitivas como a veces hacía la instalación clásica con hoisting plano).

4. Referencia otros paquetes de este monorepo siempre con **`"workspace:^"`** (p. ej. `"@zauru-sdk/types": "workspace:^"`). No uses solo `^x.y.z` hacia otro paquete del mismo repo: en `lerna publish` pnpm intentaría resolverlo en npm antes de que exista la release.

5. No hace falta tocar `pnpm-workspace.yaml` si el paquete cae bajo el glob `packages/webapp/*`.

6. `pnpm install` y `pnpm run build` para comprobar que compila.

7. En el **primer** release del paquete nuevo, Lerna/npm deben poder crear el nombre en el scope `@zauru-sdk` (permisos de organización en npm). A partir de ahí, `pnpm run publish:packages` lo incluirá cuando haya cambios versionados.

## Enlazar paquetes localmente (desarrollo)

Desde la raíz, puedes enlazar un paquete concreto al global de pnpm:

```bash
pnpm --filter @zauru-sdk/config link --global
pnpm --filter @zauru-sdk/services link --global
# … repite para los que necesites
```

En el proyecto consumidor:

```bash
pnpm link @zauru-sdk/config @zauru-sdk/services
```

Para quitar enlaces:

```bash
pnpm unlink @zauru-sdk/config
```

(Alternativa: en el consumidor usa `workspace:` o rutas `file:../zauru-typescript-sdk/packages/webapp/...` solo para desarrollo local.)

## Notas sobre pnpm

- La configuración de workspaces está en [`pnpm-workspace.yaml`](pnpm-workspace.yaml).
- En la raíz hay un [`.npmrc`](.npmrc) con `public-hoist-pattern` para tipos, **registry** y **`@zauru-sdk:registry`** apuntando a `https://registry.npmjs.org/`.
- Los tokens npm no deben versionarse: usa `~/.npmrc` o variables de entorno en CI. El archivo **`.npmrc.local`** no lo carga npm/pnpm por defecto (solo si lo enlazas tú o copias el token a `~/.npmrc`).

npx lerna run build --scope '@appocus/*'
