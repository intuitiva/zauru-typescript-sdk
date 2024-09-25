import React, { ReactNode } from "react";
/**
 * SidePanel Component
 *
 * This component creates a collapsible side panel that can be toggled open and closed.
 *
 * @param {ReactNode} children - The content to be displayed inside the side panel.
 * @param {boolean} [closeOnClickOutside=true] - If true, the panel will close when clicking outside of it.
 * @param {number} [widthPercentage=25] - The width of the panel as a percentage of the viewport width.
 * @param {string} [buttonIcon="chevron"] - The icon to use for the toggle button. Can be "chevron", "filter", or a custom ReactNode.
 *
 * @returns A toggleable side panel component.
 */
interface SidePanelProps {
    children: ReactNode;
    closeOnClickOutside?: boolean;
    widthPercentage?: number;
    buttonIcon?: "chevron" | "filter" | ReactNode;
}
declare const SidePanel: React.FC<SidePanelProps>;
export default SidePanel;
