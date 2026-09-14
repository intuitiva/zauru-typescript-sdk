import React from "react";

type Props = {
  children: React.ReactNode;
};

export const OutletContainer = (props: Props) => {
  const { children } = props;
  return (
    <div className="min-w-0 flex-1 overflow-x-auto" suppressHydrationWarning>
      {children}
    </div>
  );
};
