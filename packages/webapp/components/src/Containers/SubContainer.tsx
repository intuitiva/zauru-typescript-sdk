import React from "react";

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  rightContent?: React.ReactNode;
};

export const SubContainer = (props: Props) => {
  const { title, description, children, className = "", rightContent } = props;

  const titleInfo = (
    <>
      {title && (
        <h3 className="text-xl font-bold leading-8 text-gray-900">{title}</h3>
      )}
      {description && (
        <p className="mt-1 text-md text-gray-600">{description}</p>
      )}
    </>
  );

  return (
    <div className={`${className}`}>
      {rightContent && (
        <div className="flex justify-between items-center">
          <div>{titleInfo}</div>
          <div>{rightContent}</div>
        </div>
      )}
      {!rightContent && titleInfo}
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  );
};
