import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { TEMPLATE_NAMES } from "@zauru-sdk/redux";
import {
  getHeaders,
  getReceptionTemplate,
  getSession,
  getVariablesByName,
} from "@zauru-sdk/services";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  if (!session.has("username")) {
    return redirect("/");
  }

  const headers = await getHeaders(cookie, session);
  const url = new URL(request.url);

  const object = url.searchParams.get("object") as TEMPLATE_NAMES;

  if (!object) {
    return Response.json({
      description: "No se envió ningún parámetro de templates a buscar",
      title: "Ocurrió un error.",
      error: true,
      type: "error",
    });
  }

  switch (object) {
    case "receptionTemplate": {
      try {
        const { reception_template_webapp_var } = await getVariablesByName(
          headers,
          session,
          ["reception_template_webapp_var"]
        );
        headers.Accept = "text/html";
        const templateResponse = await getReceptionTemplate(
          headers,
          reception_template_webapp_var
        );

        if (templateResponse.error || !templateResponse.data) {
          return Response.json({
            [object]: {},
            error: true,
            type: "error",
            title: `Ocurrió un error al obtener la información de ${object}!.`,
            description: `${templateResponse.userMsg}`,
          });
        }
        return {
          [object]: templateResponse.data,
        };
      } catch (error) {
        console.error(error);
        return Response.json({
          [object]: {},
          description: error?.toString(),
          title: `Ocurrió un error al obtener la información de ${object}!.`,
          error: true,
          type: "error",
        });
      }
    }
  }

  return Response.json({
    description: "No se envió ningún parámetro de object a buscar en templates",
    title: "Ocurrió un error.",
    error: true,
    type: "error",
  });
};

export default function TemplatesCatalogsRoute() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      TEMPLATES LOAD
    </div>
  );
}
