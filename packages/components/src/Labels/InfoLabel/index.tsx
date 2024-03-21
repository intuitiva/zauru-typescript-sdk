import React from "react";

type Props = {
  description: string;
  title: string;
  className?: string;
};

export const InfoLabel = (props: Props) => {
  const { description, title, className } = props;
  return (
    <div className={`block ${className}`}>
      <label className="inline text-sm font-medium text-gray-700">
        {`${title.toUpperCase()} `}
      </label>
      <label className="inline text-sm font-medium text-gray-500">
        {description}
      </label>
    </div>
  );
};
