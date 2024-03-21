import React from "react";
//H1 Title Component
export const TitleH1 = ({ texto }: any) => {
  return (
    <div className="mb-1">
      <h1 className="text-4xl font-bold leading-normal mt-0 mb-2 text-zinc-800">
        {texto}
      </h1>
    </div>
  );
};
