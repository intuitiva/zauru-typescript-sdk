import React from "react";

type Props = {
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  className?: string;
  rightContent?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export const Container = (props: Props) => {
  const {
    title,
    description,
    children,
    className = "",
    rightContent,
    collapsible = false,
    defaultOpen = true,
  } = props;

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

  const header = rightContent ? (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
      <div className="max-w-3xl">{titleInfo}</div>
      <div className="flex-shrink-0">{rightContent}</div>
    </div>
  ) : (
    titleInfo
  );

  const body = <div className="mt-5 space-y-5">{children}</div>;

  if (collapsible) {
    return (
      <div className={`mx-2 ${className}`}>
        <details className="group" {...(defaultOpen ? { open: true } : {})}>
          <summary className="flex cursor-pointer list-none items-start gap-3 rounded-md py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
            <span
              aria-hidden="true"
              className="mt-2 inline-block h-0 w-0 shrink-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-gray-700 transition-transform group-open:rotate-90"
            />
            <div className="min-w-0 flex-1">{header}</div>
          </summary>
          {body}
        </details>
      </div>
    );
  }

  return (
    <div className={`mx-2 ${className}`}>
      {header}
      {body}
    </div>
  );
};
