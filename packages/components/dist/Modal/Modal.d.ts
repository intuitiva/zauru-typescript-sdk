import React from "react";
export type ModalOption = "OK" | "CANCEL" | null;
type ModalParams = {
    title: string;
    description: React.ReactNode | (() => React.ReactNode);
    okButtonText?: string;
    showOptions?: boolean;
};
export declare const createModal: ({ title, description, okButtonText, showOptions, }: ModalParams) => Promise<ModalOption>;
export {};
