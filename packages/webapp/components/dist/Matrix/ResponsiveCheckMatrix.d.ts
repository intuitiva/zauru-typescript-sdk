import { ReactNode } from "react";
import { CheckMatrixCardsProps } from "./CheckMatrixCards.js";
export interface ResponsiveCheckMatrixProps extends CheckMatrixCardsProps {
    desktop: ReactNode;
    desktopBreakpoint?: "sm" | "md" | "lg";
}
export declare const ResponsiveCheckMatrix: ({ desktop, desktopBreakpoint, ...cardProps }: ResponsiveCheckMatrixProps) => import("react/jsx-runtime").JSX.Element;
