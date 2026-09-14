type Props = {
    className?: string;
    title: string;
    description: any;
    showCloseButton?: boolean;
    onClose?: () => void;
    type?: "success" | "info" | "warning";
    loading?: boolean;
};
export declare const StaticAlert: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
