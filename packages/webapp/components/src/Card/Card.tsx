import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export const Card = (props: Props) => {
  const { children, title, className } = props;

  return (
    <div
      className={`p-4 space-y-3 shadow sm:overflow-hidden sm:rounded-md ${className}`}
    >
      {title && (
        <label className="inline text-lg font-medium text-gray-700">
          {`${title.toUpperCase()}`}
        </label>
      )}
      {children}
    </div>
  );
};
