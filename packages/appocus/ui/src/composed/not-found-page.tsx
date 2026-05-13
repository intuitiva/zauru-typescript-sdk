import * as React from "react";
import { Link } from "react-router";
import { useAppocusConfig } from "@appocus/config";
import { Button } from "../primitives/button.js";

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
export function NotFoundPage({
  homeTo = "/",
  loginTo = "/login",
}: NotFoundPageProps = {}) {
  const { assets, copy } = useAppocusConfig();
  const c = copy.notFoundPage;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="mb-8">
        <img
          src={assets.notFound}
          alt={c.imageAlt}
          className="w-full max-w-md mx-auto"
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {c.heading}
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        {c.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link to={homeTo}>{c.homeCta}</Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link to={loginTo}>{c.loginCta}</Link>
        </Button>
      </div>

      <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
        {c.errorCode}
      </p>
    </div>
  );
}
