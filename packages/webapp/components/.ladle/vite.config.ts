import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const ladleDir = fileURLToPath(new URL(".", import.meta.url));
const webapp = path.resolve(ladleDir, "../..");

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@zauru-sdk/icons": path.resolve(webapp, "icons/src/index.ts"),
      "@zauru-sdk/common": path.resolve(webapp, "common/src/index.ts"),
      "@zauru-sdk/types": path.resolve(webapp, "types/src/index.ts"),
      "@zauru-sdk/redux": path.resolve(webapp, "redux/src/index.ts"),
      "@zauru-sdk/hooks": path.resolve(webapp, "hooks/src/index.ts"),
      "@zauru-sdk/utils": path.resolve(webapp, "utils/src/index.ts"),
      "@zauru-sdk/graphql": path.resolve(webapp, "graphql/src/index.ts"),
      "@zauru-sdk/services": path.resolve(webapp, "services/src/index.ts"),
      "@zauru-sdk/config": path.resolve(webapp, "config/src/index.ts"),
    },
  },
});
