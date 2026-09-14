import React from "react";

type Props = {
  children: React.ReactNode;
  text: string;
};

export const WithTooltip = (props: Props) => {
  const { children, text } = props;

  return (
    <div className="group relative inline-block">
      {children}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="relative bg-black text-white text-sm rounded py-1 px-2 text-wrap w-40">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      </div>
    </div>
  );
};
