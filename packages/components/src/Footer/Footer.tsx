import React, { useEffect, useState } from "react";
import { LoadingInputSkeleton } from "../Skeletons/index.js";
import { ConnectionState } from "./../ConnectionState/index.js";

type FooterProps = {
  href: string;
  showConnection?: boolean;
  selectedColor:
    | "purple"
    | "pink"
    | "indigo"
    | "cyan"
    | "slate"
    | "green"
    | "red"
    | "sky";
};

const COLORS = {
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  indigo: "bg-indigo-500",
  cyan: "bg-cyan-500",
  slate: "bg-slate-500",
  green: "bg-green-500",
  red: "bg-red-500",
  sky: "bg-sky-500",
};

export const Footer = ({
  href,
  selectedColor,
  showConnection = false,
}: FooterProps) => {
  const [client, setIsClient] = useState(false);
  const color = COLORS[selectedColor];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!client) {
    return <LoadingInputSkeleton />;
  }

  return (
    <footer className={`inset-x-0 bottom-0 px-2 py-[20px] ${color}`}>
      <div className="px-4 mx-auto flex flex-wrap items-center justify-center">
        <p className="text-white text-[1.2rem]">
          {`Creado en `} <a href={href}>Zauru</a>{" "}
          {`con ❤️ ${new Date().getFullYear()} v.3.2`}
        </p>
        {showConnection && (
          <div className="ml-5">
            <ConnectionState />
          </div>
        )}
      </div>
    </footer>
  );
};
