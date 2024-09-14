import { Form } from "@remix-run/react";

type Props = {
  title?: string;
  description?: string;
  loading?: boolean;
  color?: "green" | "blue" | "red" | "purple" | "yellow";
};

export const HomeLayout = ({
  title,
  description,
  loading,
  color = "green",
}: Props) => {
  const getColorClasses = (shade: number) => {
    switch (color) {
      case "blue":
        return `bg-blue-${shade}`;
      case "red":
        return `bg-red-${shade}`;
      case "purple":
        return `bg-purple-${shade}`;
      case "yellow":
        return `bg-yellow-${shade}`;
      default:
        return `bg-green-${shade}`;
    }
  };

  const getGradientClasses = () => {
    switch (color) {
      case "blue":
        return "from-blue-100 to-blue-200";
      case "red":
        return "from-red-100 to-red-200";
      case "purple":
        return "from-purple-100 to-purple-200";
      case "yellow":
        return "from-yellow-100 to-yellow-200";
      default:
        return "from-green-100 to-green-200";
    }
  };

  const getButtonClasses = () => {
    switch (color) {
      case "blue":
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      case "red":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500";
      case "yellow":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
      default:
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500";
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getGradientClasses()} flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden`}
    >
      <div
        className={`absolute top-0 left-0 w-64 h-64 ${getColorClasses(
          500
        )} rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-96 h-96 ${getColorClasses(
          600
        )} rounded-full translate-x-1/3 translate-y-1/3 opacity-40`}
      ></div>
      <div
        className={`absolute top-1/2 left-1/4 w-48 h-48 ${getColorClasses(
          400
        )} rounded-full opacity-30`}
      ></div>

      <div
        className={`absolute top-1/3 right-1/4 w-32 h-32 ${getColorClasses(
          500
        )} rounded-full opacity-25`}
      ></div>
      <div
        className={`absolute bottom-1/4 left-1/3 w-40 h-40 ${getColorClasses(
          400
        )} rounded-full opacity-20`}
      ></div>
      <div
        className={`absolute top-3/4 right-1/2 w-24 h-24 ${getColorClasses(
          600
        )} rounded-full opacity-15`}
      ></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <img className="mx-auto h-12 w-auto" src="/logo.png" alt="Zauru Logo" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title ?? "Bienvenido"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {description ?? "Inicie sesión para acceder a su cuenta"}
        </p>
      </div>

      {loading ? (
        <></>
      ) : (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white bg-opacity-90 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <Form className="space-y-6" method="post" action="/login">
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${getButtonClasses()} transition duration-150 ease-in-out`}
                >
                  Inicie sesión con Zauru
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};
