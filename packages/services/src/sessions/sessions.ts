import { createCookie } from "@remix-run/node";
import { createUpstashSessionStorage } from "./upstash.js";

const sessionCookie = createCookie("_rj_session", {
  secrets: ["r3m1xr0ck1"],
  path: "/",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  httpOnly: true,
  maxAge: 60 * 60 * 24,
  //expires,
  secure: process.env.NODE_ENV === "production",
});

const { getSession, commitSession, destroySession } =
  createUpstashSessionStorage({ cookie: sessionCookie });

export { getSession, commitSession, destroySession };
