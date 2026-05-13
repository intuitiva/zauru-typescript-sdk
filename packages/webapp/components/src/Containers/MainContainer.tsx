import React from "react";

type Props = {
  children: React.ReactNode;
};

export const MainContainer = (props: Props) => {
  const { children } = props;

  return (
    <>
      <div className="md:p-10 p-0 mt-10 ml-2 mr-2 mb-10 md:mt-0 md:ml-0 md:mr-0 md:mb-0">
        {children}
      </div>
    </>
  );
};
