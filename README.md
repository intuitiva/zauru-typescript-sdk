# zauru-typescript-sdk

yarn install

npx lerna run build

npx lerna publish

Usa lerna exec para crear enlaces simbólicos globalmente:
Puedes usar lerna exec para ejecutar comandos arbitrarios en cada uno de tus paquetes. En este caso, puedes usarlo para ejecutar npm link en el directorio de cada librería, lo que creará un enlace simbólico global para cada una de ellas. Ejecuta el siguiente comando en la raíz de tu monorepo:

npx lerna exec -- npm link

Luego en el proyecto se usa

npm link @zauru-sdk/common
npm link @zauru-sdk/config
npm link @zauru-sdk/graphql
npm link @zauru-sdk/hooks
npm link @zauru-sdk/icons
npm link @zauru-sdk/redux
npm link @zauru-sdk/services
npm link @zauru-sdk/types
npm link @zauru-sdk/utils
