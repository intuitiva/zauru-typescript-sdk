import React, { useEffect, useState } from "react";

export const ProgressCircle = ({
  total,
  completed,
  description,
  title,
}: {
  total: number;
  completed: number;
  description: string;
  title?: string;
}) => {
  const [percentage, setPercentage] = useState(0);
  const strokeDasharray = 2 * Math.PI * 42; // radio del circulo
  const progressColor = `rgba(${255 - 2.55 * percentage}, ${
    2.55 * percentage
  }, 0)`;

  useEffect(() => {
    if (total > 0) {
      setPercentage((completed / total) * 100);
    } else {
      setPercentage(100);
    }
  }, [total, completed]);

  return (
    <div className="flex flex-col items-center justify-center">
      {title && (
        <h2 className="mb-4 text-xl text-center text-gray-700">{title}</h2>
      )}
      <svg width="100" height="100" className="relative">
        <circle
          r="42"
          cx="50"
          cy="50"
          fill="transparent"
          stroke="#eee"
          strokeWidth="8"
        />
        <circle
          r="42"
          cx="50"
          cy="50"
          fill="transparent"
          stroke={progressColor}
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={
            strokeDasharray - strokeDasharray * (percentage / 100)
          }
          strokeLinecap="round"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fill={progressColor}
          style={{
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {`${Math.round(percentage)}%`}
        </text>
      </svg>
      <p className="mt-2 text-center text-gray-500">{description}</p>
    </div>
  );
};
