import React from "react";

type Props = {
  children: React.ReactNode;
};

export const OutletContainer = (props: Props) => {
  const { children } = props;
  return (
    <>
      <div className="flex-1 overflow-x-auto">{children}</div>
    </>
  );
};
