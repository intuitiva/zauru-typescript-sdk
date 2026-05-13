import React from "react";
interface ProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    current: number;
    total: number;
    currentItem?: string;
    description?: string;
}
export declare const ProgressModal: React.FC<ProgressModalProps>;
export {};
