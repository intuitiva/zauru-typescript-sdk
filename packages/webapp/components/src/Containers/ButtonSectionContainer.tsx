import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const ButtonSectionContainer = (props: Props) => {
  const { children, className } = props;

  return (
    <div
      className={`mt-5 flex flex-col md:flex-row md:justify-end md:items-center space-x-0 space-y-4 md:space-y-0 md:space-x-4 ${className}`}
    >
      {children}
    </div>
  );
};
