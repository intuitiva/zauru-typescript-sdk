import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const TripleFieldContainer = (props: Props) => {
  const { children, className } = props;

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
      <div
        className={`grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
        style={{ alignItems: "center" }}
      >
        <div className="col-span-1">{getChildren(0)}</div>
        <div className="col-span-1">{getChildren(1)}</div>
        <div className="col-span-1">{getChildren(2)}</div>
      </div>
    </>
  );
};
