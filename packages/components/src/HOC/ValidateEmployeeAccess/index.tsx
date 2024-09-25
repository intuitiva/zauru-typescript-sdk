import {
  useGetEmployeeProfile,
  useGetSessionAttribute,
} from "@zauru-sdk/hooks";
import { Link } from "@remix-run/react";

export const ValidateEmployeeAccess = ({
  children,
  permissionVariableName,
  showIfNoPermission = false,
}: {
  children: React.ReactNode;
  permissionVariableName: string;
  showIfNoPermission?: boolean;
}) => {
  const { data: employee } = useGetEmployeeProfile();
  const variable_string = useGetSessionAttribute(
    permissionVariableName,
    "sessionVariable"
  );

  const variable = variable_string?.split(",");
  const hasPermission = variable?.includes(employee?.id?.toString() || "-1");

  if (showIfNoPermission && !hasPermission) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
        <img src="/logo.png" alt="Zauru Logo" className="mb-8 h-20" />
        <h1 className="text-5xl font-extrabold text-red-500 mb-6">
          ¡Acceso Denegado!
        </h1>
        <div className="w-full max-w-2xl">
          <p className="text-2xl text-gray-300 mb-8 text-center">
            Lo sentimos, no tienes permiso para acceder a esta página.
          </p>
        </div>
        <Link
          to="/"
          className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Regresar al inicio
        </Link>
        <div className="mt-12 text-gray-500">
          <p>Si crees que esto es un error, por favor contacta a soporte.</p>
        </div>
      </div>
    );
  }

  return <>{hasPermission ? children : null}</>;
};
