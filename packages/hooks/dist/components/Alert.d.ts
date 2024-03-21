export type AlertType = "success" | "error" | "info" | "warning";
export type AlertProps = {
    type: AlertType;
    title: string;
    description: string;
    onClose?: () => void;
};
export declare const showAlert: (alertProps: AlertProps) => void;
