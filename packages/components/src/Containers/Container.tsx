import React from "react";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  rightContent?: React.ReactNode;
};

export const Container = (props: Props) => {
  const { title, description, children, className = "", rightContent } = props;

  const titleInfo = (
    <>
      {title && (
        <h3 className="text-3xl font-bold leading-8 text-gray-900">{title}</h3>
      )}
      {description && (
        <p className="mt-1 text-md text-gray-600">{description}</p>
      )}
    </>
  );

  return (
    <>
      <div className={`mx-2 ${className}`}>
        {rightContent && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="max-w-3xl">{titleInfo}</div>
            <div className="flex-shrink-0">{rightContent}</div>
          </div>
        )}
        {!rightContent && titleInfo}
        <div className="mt-5 space-y-5">{children}</div>
      </div>
    </>
  );
};
