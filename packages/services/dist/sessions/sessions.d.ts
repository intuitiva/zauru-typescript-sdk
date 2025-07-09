import { Session } from "@remix-run/node";
declare const getSession: (cookieHeader?: string | null, options?: import("cookie").CookieParseOptions) => Promise<Session<import("@remix-run/node").SessionData, import("@remix-run/node").SessionData>>, commitSession: (session: Session<import("@remix-run/node").SessionData, import("@remix-run/node").SessionData>, options?: import("cookie").CookieSerializeOptions) => Promise<string>, destroySession: (session: Session<import("@remix-run/node").SessionData, import("@remix-run/node").SessionData>, options?: import("cookie").CookieSerializeOptions) => Promise<string>;
declare const getRefreshSession: (request: Request) => Promise<string | null>;
export { getSession, commitSession, destroySession, getRefreshSession };
