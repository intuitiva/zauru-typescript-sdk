function isUnauthorizedPayload(body: unknown): boolean {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as { code?: string }).code === "UNAUTHORIZED"
  );
}

/**
 * Like `fetch` with `credentials: "include"`, but on a 401 carrying
 * `{ code: "UNAUTHORIZED" }` opens the reauth popup and retries **once**.
 */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const merged: RequestInit = {
    ...init,
    credentials: init?.credentials ?? "include",
  };

  let res = await fetch(input, merged);

  if (res.status !== 401 || typeof window === "undefined") {
    return res;
  }

  let body: unknown;
  try {
    body = await res.clone().json();
  } catch {
    return res;
  }

  if (!isUnauthorizedPayload(body)) {
    return res;
  }

  try {
    const { requestReauthInPopup } = await import(
      "./reauth-popup.client.js"
    );
    await requestReauthInPopup();
  } catch {
    return res;
  }

  return fetch(input, merged);
}
