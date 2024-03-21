import React from "react";
type Props = {
    saveTitle?: string;
    saveName?: string;
    onClickSave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    showCancel?: boolean;
    cancelTitle?: string;
    cancelName?: string;
    showClear?: boolean;
    clearTitle?: string;
    clearName?: string;
    loading?: boolean;
    loadingSaveText?: string;
};
export declare const FormButtons: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
