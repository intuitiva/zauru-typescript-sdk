import React from "react";

type Props = {
  title?: string;
  percent?: string;
};

export const ProgressBar = (props: Props) => {
  const { title, percent } = props;
  return (
    <>
      {percent && (
        <>
          {title && <div className="mb-1 text-lg font-medium">{title}</div>}
          <div className="w-full h-6 bg-gray-200 rounded-full">
            <div
              className="h-6 bg-blue-600 rounded-full"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </>
      )}
    </>
  );
};
