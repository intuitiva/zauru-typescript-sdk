"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroySession = exports.commitSession = exports.getSession = void 0;
const node_1 = require("@remix-run/node");
const upstash_js_1 = require("./upstash.js");
const sessionCookie = (0, node_1.createCookie)("_rj_session", {
    secrets: ["r3m1xr0ck1"],
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    //expires,
    secure: process.env.NODE_ENV === "production",
});
const { getSession, commitSession, destroySession } = (0, upstash_js_1.createUpstashSessionStorage)({ cookie: sessionCookie });
exports.getSession = getSession;
exports.commitSession = commitSession;
exports.destroySession = destroySession;
