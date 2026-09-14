"use client";

import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
  text: string;
};

export const Tooltip = ({ children, text }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div
          className="absolute z-10 bg-gray-700 text-white px-2 py-1 rounded-md bottom-full left-1/2 transform -translate-x-1/2"
          style={{ whiteSpace: "nowrap", height: "2rem" }}
        >
          {text}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: "0",
              height: "0",
              borderTop: "6px solid transparent",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "6px solid gray",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};
