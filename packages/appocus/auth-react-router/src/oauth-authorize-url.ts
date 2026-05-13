import { config } from "@zauru-sdk/webapp-config";

/**
 * Build the Zauru OAuth `dialog/authorize` URL using the host's `request.url` to
 * derive the `redirect_uri`. Pass `options.state` to mark this authorization as
 * coming from a reauth popup.
 */
export function buildOAuthAuthorizeURL(
  requestUrl: string,
  options?: { state?: string },
): string {
  const origin = new URL(requestUrl).origin;
  const params = new URLSearchParams({
    client_id: String(config.oauthClientID ?? ""),
    response_type: "code",
    redirect_uri: `${origin}/callback`,
  });
  if (options?.state) {
    params.set("state", options.state);
  }
  const base = config.oauthBaseURL?.replace(/\/$/, "") ?? "";
  return `${base}/dialog/authorize?${params.toString()}`;
}
