"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zendeskJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function zendeskJwt(current_user, configuration) {
    // get the INFO
    const jwtSecret = configuration.zendeskJWTSecret;
    const jwtKey = configuration.zendeskJWTKey;
    const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // Expires in 1 day
    // create the payload
    const payload = {
        external_id: "z" +
            current_user.selected_entity_id.toString() +
            "-" +
            current_user.id.toString(),
        email: current_user.email,
        name: current_user.name,
        organization_id: current_user.selected_entity_id.toString(),
        scope: "user",
        exp: expiresIn,
    };
    const jwtHeader = { kid: jwtKey, typ: "JWT", alg: "HS256" };
    return jsonwebtoken_1.default.sign(payload, jwtSecret, {
        algorithm: "HS256",
        header: jwtHeader,
    });
}
exports.zendeskJwt = zendeskJwt;
