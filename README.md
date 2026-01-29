# zauru-typescript-sdk

Este proyecto utiliza [Lerna](https://lerna.js.org/) para gestionar un monorepo que contiene múltiples paquetes relacionados con el SDK de TypeScript de Zauru.

## Instalación

Para instalar las dependencias del monorepo, ejecuta el siguiente comando en la raíz del proyecto:

```bash
yarn install
```

Para construir todos los paquetes, ejecuta:

```bash
npx lerna run build

npm login

npm config set //registry.npmjs.org/:_authToken "TU_TOKEN_AQUI"

npx lerna publish
```

Usa lerna exec para crear enlaces simbólicos globalmente:
Puedes usar lerna exec para ejecutar comandos arbitrarios en cada uno de tus paquetes. En este caso, puedes usarlo para ejecutar npm link en el directorio de cada librería, lo que creará un enlace simbólico global para cada una de ellas. Ejecuta el siguiente comando en la raíz de tu monorepo:

```bash
npx lerna exec -- npm link
```

Luego en el proyecto se usa

```bash
npm link @zauru-sdk/common
npm link @zauru-sdk/config
npm link @zauru-sdk/graphql
npm link @zauru-sdk/hooks
npm link @zauru-sdk/icons
npm link @zauru-sdk/redux
npm link @zauru-sdk/services
npm link @zauru-sdk/types
npm link @zauru-sdk/utils

npm unlink @zauru-sdk/common
npm unlink @zauru-sdk/config
npm unlink @zauru-sdk/graphql
npm unlink @zauru-sdk/hooks
npm unlink @zauru-sdk/icons
npm unlink @zauru-sdk/redux
npm unlink @zauru-sdk/services
npm unlink @zauru-sdk/types
npm unlink @zauru-sdk/utils
```
