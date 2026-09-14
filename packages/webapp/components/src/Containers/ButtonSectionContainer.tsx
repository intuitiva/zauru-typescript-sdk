import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Fondo gris de pie de formulario. El nombre `whitBg` se conserva por compatibilidad con las webapps. */
  whitBg?: boolean;
};

export const ButtonSectionContainer = (props: Props) => {
  const { children, className, whitBg = false } = props;

  return (
    <div
      className={`${whitBg ? "bg-gray-50 px-4 py-3 sm:px-6" : ""} mt-5 flex flex-col md:flex-row md:justify-end md:items-center space-x-0 space-y-4 md:space-y-0 md:space-x-4 ${className}`}
    >
      {children}
    </div>
  );
};
