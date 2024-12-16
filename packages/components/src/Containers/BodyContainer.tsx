import React from "react";

type Props = {
  children: React.ReactNode;
};

export const BodyContainer = (props: Props) => {
  const { children } = props;
  return <body className="flex flex-col min-h-screen m-0">{children}</body>;
};
