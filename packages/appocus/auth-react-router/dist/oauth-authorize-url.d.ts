/**
 * Build the Zauru OAuth `dialog/authorize` URL using the host's `request.url` to
 * derive the `redirect_uri`. Pass `options.state` to mark this authorization as
 * coming from a reauth popup.
 */
export declare function buildOAuthAuthorizeURL(requestUrl: string, options?: {
    state?: string;
}): string;
