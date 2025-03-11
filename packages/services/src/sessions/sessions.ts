import { createCookie, Session } from "@remix-run/node";
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

const getRefreshSession = async (request: Request, session: Session) => {
  try {
    const cookie = request.headers.get("Cookie");
    const currentSession = await getSession(cookie);

    if (!currentSession) {
      return null;
    }

    return await commitSession(session, {
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    console.error("Ocurrio un error al refrescar la session", error);
    return null;
  }
};

export { getSession, commitSession, destroySession, getRefreshSession };
