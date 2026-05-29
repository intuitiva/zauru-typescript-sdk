/**
 * Reemplaza dependencias internas @zauru-sdk/* y @appocus/* (rangos semver) por workspace:^.
 * Lerna reescribe workspace:^ a ^X.Y.Z al versionar; este script restaura el protocolo
 * workspace antes de que pnpm sincronice el lockfile.
 *
 * Se ejecuta automáticamente como lifecycle "version" en el package.json raíz.
 */
import fs from "fs";
import path from "path";

const INTERNAL_SCOPES = ["@zauru-sdk/", "@appocus/"];
const PKG_ROOTS = ["packages/webapp", "packages/appocus"];

for (const root of PKG_ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const dir of fs.readdirSync(root)) {
    const pkgPath = path.join(root, dir, "package.json");
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    let changed = false;
    for (const section of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
    ]) {
      if (!pkg[section]) continue;
      for (const [name, ver] of Object.entries(pkg[section])) {
        if (
          INTERNAL_SCOPES.some((s) => name.startsWith(s)) &&
          typeof ver === "string" &&
          !ver.startsWith("workspace:") &&
          ver !== "*"
        ) {
          pkg[section][name] = "workspace:^";
          changed = true;
        }
      }
    }
    if (changed) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      console.log("updated", pkgPath);
    }
  }
}
