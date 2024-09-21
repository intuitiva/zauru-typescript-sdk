import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  useRouteError,
  Link,
} from "@remix-run/react";

export const ErrorLayout = () => {
  const error = useRouteError();

  return (
    <html lang="es" className="bg-gray-900 text-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>¡Ups! Algo salió mal</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col items-center justify-center p-4">
        <img src="/logo.png" alt="Zauru Logo" className="mb-8 h-20" />
        <h1 className="text-5xl font-extrabold text-red-500 mb-6">¡Ups!</h1>
        <div className="w-full max-w-2xl">
          <p className="text-2xl text-gray-300 mb-8 text-center">
            {isRouteErrorResponse(error)
              ? `Error ${error.status}: ${error.statusText}`
              : error instanceof Error
              ? error.message
              : "Ha ocurrido un error inesperado"}
          </p>
        </div>
        <Link
          to="/"
          className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Regresar al inicio
        </Link>
        <div className="mt-12 text-gray-500">
          <p>Si el problema persiste, por favor contacta a soporte.</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
};
