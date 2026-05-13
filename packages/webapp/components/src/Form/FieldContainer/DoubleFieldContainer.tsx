import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  alignCenter?: boolean;
};

export const DoubleFieldContainer = (props: Props) => {
  const { children, className, alignCenter = true } = props;

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
        className={`grid md:grid-cols-2 sm:grid-cols-1 gap-4 ${className}`}
        style={alignCenter ? { alignItems: "center" } : {}}
      >
        <div className="col-span-1">{getChildren(0)}</div>
        <div className="col-span-1">{getChildren(1)}</div>
      </div>
    </>
  );
};
