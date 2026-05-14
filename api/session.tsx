import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { config } from "@zauru-sdk/config";
import { SERVER_CONFIG_TYPES } from "@zauru-sdk/hooks";
import {
  getHeaders,
  getSession,
  getVariablesByName,
} from "@zauru-sdk/services";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const headers = await getHeaders(cookie, session);

  if (!session.has("username")) {
    return redirect("/");
  }

  const url = new URL(request.url);

  const name = url.searchParams.get("name") as string;
  const type = url.searchParams.get("type") as SERVER_CONFIG_TYPES;

  if (!name || !type) {
    return Response.json({
      data: "",
      description: "No se envió ningún parámetro de name o type a buscar",
      title: "Ocurrió un error.",
      error: true,
      type: "error",
    });
  }

  if (type === "environment") {
    return Response.json({
      data: (config as any)[name] as string,
    });
  } else if (type === "sessionVariable") {
    try {
      const response = await getVariablesByName(headers, session, [name]);
      return Response.json({ data: response[name] });
    } catch (error) {
      return Response.json({
        data: "",
        description: `No se encontró la variable ${name} en la sesión`,
        title: "Ocurrió un error.",
        error: true,
        type: "error",
      });
    }
  }

  return Response.json({
    data: session.get(name) as string,
  });
};

export default function SessionRoute() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      SESSION LOAD
    </div>
  );
}
