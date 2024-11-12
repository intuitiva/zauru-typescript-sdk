import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  whitBg?: boolean;
};

export const ButtonSectionContainer = (props: Props) => {
  const { children, className, whitBg = false } = props;

  return (
    <div
      className={`${
        whitBg ? "bg-gray-50" : ""
      } px-4 py-3 text-right sm:px-6 ${className}`}
    >
      {children}
    </div>
  );
};
