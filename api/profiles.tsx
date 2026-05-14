import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { PROFILE_NAMES } from "@zauru-sdk/redux";
import {
  getAgencyInfo,
  getEmployeeInfo,
  getHeaders,
  getOauthUserInfo,
  getProfileInformation,
  getSession,
} from "@zauru-sdk/services";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  if (!session.has("username")) {
    return redirect("/");
  }

  const headers = await getHeaders(cookie, session);
  const url = new URL(request.url);

  const profile = url.searchParams.get("profile") as PROFILE_NAMES;

  if (!profile) {
    return Response.json({
      description: "No se envió ningún parámetro de perfil a buscar",
      title: "Ocurrió un error.",
      error: true,
      type: "error",
    });
  }

  switch (profile) {
    case "oauthProfile": {
      const userInfoResponse = await getOauthUserInfo(session.get("code"));
      if (userInfoResponse.error || !userInfoResponse.data) {
        return Response.json({
          [profile]: {},
          error: true,
          type: "error",
          title: `Ocurrió un error al obtener la información de ${profile}!.`,
          description: `${userInfoResponse.userMsg}`,
        });
      }

      return {
        [profile]: userInfoResponse.data,
      };
    }
    case "agencyProfile": {
      const agencyInfo = await getAgencyInfo(headers, session);

      if (agencyInfo.error || !agencyInfo.data) {
        return Response.json({
          [profile]: {},
          error: true,
          type: "error",
          title: `Ocurrió un error al obtener la información de ${profile}!.`,
          description: `${agencyInfo.userMsg}`,
        });
      }
      return {
        [profile]: agencyInfo.data,
      };
    }
    case "employeeProfile": {
      const employeeProfile = await getEmployeeInfo(
        Number(session.get("employee_id")),
        headers
      );

      if (employeeProfile.error || !employeeProfile.data) {
        return Response.json({
          [profile]: {},
          error: true,
          type: "error",
          title: `Ocurrió un error al obtener la información de ${profile}!.`,
          description: `${employeeProfile.userMsg}`,
        });
      }
      return {
        [profile]: employeeProfile.data,
      };
    }
    case "userProfile": {
      const userProfile = await getProfileInformation(headers);

      if (userProfile.error || !userProfile.data) {
        return Response.json({
          [profile]: {},
          error: true,
          type: "error",
          title: `Ocurrió un error al obtener la información de ${profile}!.`,
          description: `${userProfile.userMsg}`,
        });
      }
      return {
        [profile]: userProfile.data,
      };
    }
  }

  return Response.json({
    description: "No se envió ningún parámetro de perfil a buscar",
    title: "Ocurrió un error.",
    error: true,
    type: "error",
  });
};

export default function ProfilesRoute() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      PROFILES LOAD
    </div>
  );
}
