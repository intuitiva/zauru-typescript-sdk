import jwt from "jsonwebtoken";

export function zendeskJwt(
  current_user: {
    selected_entity_id: number;
    id: number;
    email: string;
    name: string;
  },
  configuration: {
    zendeskJWTSecret: string;
    zendeskJWTKey: string;
  }
) {
  // get the INFO
  const jwtSecret = configuration.zendeskJWTSecret;
  const jwtKey = configuration.zendeskJWTKey;
  const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // Expires in 1 day

  // create the payload
  const payload = {
    external_id:
      "z" +
      current_user.selected_entity_id.toString() +
      "-" +
      current_user.id.toString(),
    email: current_user.email,
    name: current_user.name,
    organization_id: current_user.selected_entity_id.toString(),
    scope: "user",
    exp: expiresIn,
  };

  const jwtHeader: jwt.JwtHeader = { kid: jwtKey, typ: "JWT", alg: "HS256" };

  return jwt.sign(payload, jwtSecret, {
    algorithm: "HS256",
    header: jwtHeader,
  });
}
