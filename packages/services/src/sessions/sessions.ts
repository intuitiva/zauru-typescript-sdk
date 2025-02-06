import { createCookie } from "@remix-run/node";
import { createUpstashSessionStorage } from "./upstash.js";

export const MAX_AGE_SESSION_COOKIE = 60 * 60 * 5; //5 hours

const sessionCookie = createCookie("_rj_session", {
  secrets: ["r3m1xr0ck1"],
  path: "/",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  httpOnly: true,
  maxAge: MAX_AGE_SESSION_COOKIE,
  secure: process.env.NODE_ENV === "production",
});

const { getSession, commitSession, destroySession } =
  createUpstashSessionStorage({ cookie: sessionCookie });

export { getSession, commitSession, destroySession };
