/**
 * Reemplaza dependencias internas @zauru-sdk/* (rangos semver) por workspace:^.
 * Lerna suele reescribir workspace:^ a ^X.Y.Z al versionar; hay que volver a ejecutar esto
 * antes de pnpm install / publish en monorepo con pnpm.
 */
const fs = require("fs");
const path = require("path");

const webappRoot = path.join("packages", "webapp");
const scope = "@zauru-sdk/";

for (const dir of fs.readdirSync(webappRoot)) {
  const pkgPath = path.join(webappRoot, dir, "package.json");
  if (!fs.existsSync(pkgPath)) continue;
  const j = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  let changed = false;
  for (const section of ["dependencies", "devDependencies", "peerDependencies"]) {
    if (!j[section]) continue;
    for (const [name, ver] of Object.entries(j[section])) {
      if (
        name.startsWith(`${scope}webapp-`) &&
        typeof ver === "string" &&
        !ver.startsWith("workspace:")
      ) {
        j[section][name] = "workspace:^";
        changed = true;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(j, null, 2) + "\n");
    console.log("updated", pkgPath);
  }
}
