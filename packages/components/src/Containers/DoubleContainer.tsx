import React from "react";

type Props = {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export const DoubleContainer = (props: Props) => {
  const { title, description, className = "", children } = props;

  const getChildren = (index: number) => {
    if (children && Array.isArray(children) && children[index]) {
      return children[index];
    }

    if (children && index === 0) {
      return children;
    }

    return <></>;
  };

  return (
    <>
      <div className={`mx-2 ${className}`}>
        {/* Font sizes https://tailwindcss.com/docs/font-size */}
        {title && (
          <h3 className="text-3xl font-bold leading-8 text-gray-900">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 text-md text-gray-600">{description}</p>
        )}
        <div className="grid xl:grid-cols-3 md:grid-cols-1 gap-4">
          <div className="xl:col-span-2 md:col-span-1 mt-5">
            {getChildren(0)}
          </div>
          <div className="xl:col-span-1 md:col-span-1 mt-5">
            {getChildren(1)}
          </div>
        </div>
      </div>
    </>
  );
};
