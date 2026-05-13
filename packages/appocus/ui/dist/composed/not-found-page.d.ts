export type NotFoundPageProps = {
    /** Override the home CTA target. Defaults to `/`. */
    homeTo?: string;
    /** Override the login CTA target. Defaults to `/login`. */
    loginTo?: string;
};
/**
 * Visual 404 page. Reads image and copy from the active `@appocus/config`.
 * Each app keeps its own route module (e.g. `app/pages/404.tsx`) that
 * exports the `loader` returning `new Response(null, { status: 404 })` and
 * the default export rendering this component.
 */
export declare function NotFoundPage({ homeTo, loginTo, }?: NotFoundPageProps): import("react/jsx-runtime").JSX.Element;
