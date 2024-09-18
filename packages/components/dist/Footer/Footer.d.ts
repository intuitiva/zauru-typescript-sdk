type FooterProps = {
    href: string;
    showConnection?: boolean;
    selectedColor: "purple" | "pink" | "indigo" | "cyan" | "slate" | "green" | "red" | "sky";
    version?: string;
};
export declare const Footer: ({ href, selectedColor, showConnection, version, }: FooterProps) => import("react/jsx-runtime").JSX.Element;
export {};
