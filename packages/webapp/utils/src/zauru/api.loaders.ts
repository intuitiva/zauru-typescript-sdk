import { createElement, type ReactElement } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { config } from "@zauru-sdk/config";
import {
  getAgencyInfo,
  getEmployeeInfo,
  getHeaders,
  getOauthUserInfo,
  getProfileInformation,
  getReceptionTemplate,
  getSession,
  getVariablesByName,
} from "@zauru-sdk/services";
import type { AxiosUtilsResponse } from "@zauru-sdk/types";
import {
  type CatalogHandler,
  createCatalogsLoader,
} from "./catalogs.loader.js";

export type ApiHandlerContext = {
  request: Request;
  session: Awaited<ReturnType<typeof getSession>>;
  headers: Awaited<ReturnType<typeof getHeaders>>;
  url: URL;
  name: string;
};

export type ApiHandler = (
  ctx: ApiHandlerContext,
) => Promise<AxiosUtilsResponse<unknown> | Response>;

export type ZauruApiLoaderExtras = {
  catalogs?: Record<string, CatalogHandler>;
  profiles?: Record<string, ApiHandler>;
  templates?: Record<string, ApiHandler>;
};

const missingParamPayload = (description: string) => ({
  description,
  title: "Ocurrió un error.",
  error: true,
  type: "error",
});

const namedErrorPayload = (
  name: string,
  empty: unknown,
  description: string,
) => ({
  [name]: empty,
  error: true,
  type: "error",
  title: `Ocurrió un error al obtener la información de ${name}!.`,
  description,
});

const sdkProfileHandlers: Record<string, ApiHandler> = {
  oauthProfile: ({ session }) => getOauthUserInfo(session.get("code")),
  agencyProfile: ({ headers, session }) => getAgencyInfo(headers, session),
  employeeProfile: ({ headers, session }) =>
    getEmployeeInfo(Number(session.get("employee_id")), headers),
  userProfile: ({ headers }) => getProfileInformation(headers),
};

const sdkTemplateHandlers: Record<string, ApiHandler> = {
  receptionTemplate: async ({ headers, session, name }) => {
    try {
      const { reception_template_webapp_var } = await getVariablesByName(
        headers,
        session,
        ["reception_template_webapp_var"],
      );
      headers.Accept = "text/html";
      return getReceptionTemplate(headers, reception_template_webapp_var);
    } catch (error) {
      console.error(error);
      return Response.json(
        namedErrorPayload(name, {}, error?.toString() ?? ""),
      );
    }
  },
};

const createNamedResourceLoader = (
  queryParam: string,
  sdkHandlers: Record<string, ApiHandler>,
  extras: Record<string, ApiHandler> | undefined,
  emptyOnError: unknown,
  missingDescription: string,
): LoaderFunction => {
  return async ({ request }) => {
    try {
      const cookie = request.headers.get("Cookie");
      const session = await getSession(cookie);

      if (!session.has("username")) {
        return redirect("/");
      }

      const headers = await getHeaders(cookie, session);
      const url = new URL(request.url);
      const name = url.searchParams.get(queryParam) ?? "";

      if (!name) {
        return Response.json(missingParamPayload(missingDescription));
      }

      const handler = extras?.[name] ?? sdkHandlers[name];
      if (!handler) {
        return Response.json(missingParamPayload(missingDescription));
      }

      const result = await handler({
        request,
        session,
        headers,
        url,
        name,
      });

      if (result instanceof Response) {
        return result;
      }

      if (result.error || !result.data) {
        return Response.json(
          namedErrorPayload(name, emptyOnError, `${result.userMsg ?? ""}`),
        );
      }

      return { [name]: result.data };
    } catch (error) {
      console.error(error);
      const name =
        new URL(request.url).searchParams.get(queryParam) || queryParam;
      return namedErrorPayload(name, emptyOnError, `${error}`);
    }
  };
};

/**
 * Remix loader for `/api/profiles`. Pass extras to add or override profile names.
 */
export function createProfilesLoader(
  extras?: Record<string, ApiHandler>,
): LoaderFunction {
  return createNamedResourceLoader(
    "profile",
    sdkProfileHandlers,
    extras,
    {},
    "No se envió ningún parámetro de perfil a buscar",
  );
}

/**
 * Remix loader for `/api/session`.
 * Modern query: `name` + `type` (`environment` | `sessionVariable` | session attr).
 * Legacy Remix 1: `attribute` only, read from the session.
 */
export function createSessionLoader(): LoaderFunction {
  return async ({ request }) => {
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const headers = await getHeaders(cookie, session);

    if (!session.has("username")) {
      return redirect("/");
    }

    const url = new URL(request.url);
    const name =
      url.searchParams.get("name") ?? url.searchParams.get("attribute") ?? "";
    const type = url.searchParams.get("type");

    if (!name) {
      return Response.json({
        data: "",
        ...missingParamPayload(
          "No se envió ningún parámetro de name o type a buscar",
        ),
      });
    }

    if (type === "environment") {
      return Response.json({
        data: (config as Record<string, unknown>)[name] as string,
      });
    }

    if (type === "sessionVariable") {
      try {
        const response = await getVariablesByName(headers, session, [name]);
        return Response.json({ data: response[name] });
      } catch {
        return Response.json({
          data: "",
          ...missingParamPayload(
            `No se encontró la variable ${name} en la sesión`,
          ),
        });
      }
    }

    return Response.json({
      data: session.get(name) as string,
    });
  };
}

/**
 * Remix loader for `/api/templates`. Pass extras to add or override template names.
 */
export function createTemplatesLoader(
  extras?: Record<string, ApiHandler>,
): LoaderFunction {
  return createNamedResourceLoader(
    "object",
    sdkTemplateHandlers,
    extras,
    {},
    "No se envió ningún parámetro de templates a buscar",
  );
}

const apiResourceLoaders = (
  extras?: ZauruApiLoaderExtras,
): Record<string, LoaderFunction> => ({
  catalogs: createCatalogsLoader(extras?.catalogs),
  profiles: createProfilesLoader(extras?.profiles),
  session: createSessionLoader(),
  templates: createTemplatesLoader(extras?.templates),
});

const apiPathSegment = (request: Request, splat?: string): string => {
  if (splat) {
    return splat.split("/").filter(Boolean)[0] ?? "";
  }
  const parts = new URL(request.url).pathname.split("/").filter(Boolean);
  return parts.at(-1) ?? "";
};

/**
 * Single Remix splat loader for `/api/catalogs|profiles|session|templates`.
 * App-specific handlers go in `extras` under the matching resource.
 */
export function createZauruApiLoader(
  extras?: ZauruApiLoaderExtras,
): LoaderFunction {
  const loaders = apiResourceLoaders(extras);

  return async (args) => {
    const segment = apiPathSegment(args.request, args.params?.["*"]);
    const loader = loaders[segment];
    if (!loader) {
      return Response.json(
        missingParamPayload(
          "No se envió ningún parámetro de catálogo a buscar",
        ),
      );
    }
    return loader(args);
  };
}

export function ProfilesRoute(): ReactElement {
  return createElement(
    "div",
    { style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" } },
    "PROFILES LOAD",
  );
}

export function SessionRoute(): ReactElement {
  return createElement(
    "div",
    { style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" } },
    "SESSION LOAD",
  );
}

export function TemplatesRoute(): ReactElement {
  return createElement(
    "div",
    { style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" } },
    "TEMPLATES LOAD",
  );
}

export function ZauruApiRoute(): ReactElement {
  return createElement(
    "div",
    { style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" } },
    "API LOAD",
  );
}
