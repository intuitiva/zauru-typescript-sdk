import React, { ReactNode } from "react";
import {
  CheckMatrixCards,
  CheckMatrixCardsProps,
} from "./CheckMatrixCards.js";

export interface ResponsiveCheckMatrixProps extends CheckMatrixCardsProps {
  desktop: ReactNode;
  desktopBreakpoint?: "sm" | "md" | "lg";
}

const visibilityClasses = {
  sm: { mobile: "sm:hidden", desktop: "hidden sm:block" },
  md: { mobile: "md:hidden", desktop: "hidden md:block" },
  lg: { mobile: "lg:hidden", desktop: "hidden lg:block" },
} as const;

export const ResponsiveCheckMatrix = ({
  desktop,
  desktopBreakpoint = "md",
  ...cardProps
}: ResponsiveCheckMatrixProps) => {
  const visibility = visibilityClasses[desktopBreakpoint];
  return (
    <>
      <div className={visibility.mobile}>
        <CheckMatrixCards {...cardProps} />
      </div>
      <div className={visibility.desktop}>{desktop}</div>
    </>
  );
};
