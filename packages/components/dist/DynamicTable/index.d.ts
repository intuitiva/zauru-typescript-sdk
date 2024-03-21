import React from "react";
type Props = {
    cellInputs?: boolean;
    intersectionTitle?: string;
    className?: string;
    onChange?: (data: string) => void;
    defaultValue?: string;
    onValidate?: (headerValue: string, rowValue: string) => boolean;
    onRemove?: () => void;
    margins?: {
        marginLeft?: number;
        marginTop?: number;
        verticalGap?: number;
        horizontalGap?: number;
    };
    forwardedRef?: React.RefObject<{
        getTotalForRows: () => number;
        getTotalForColumns: () => number;
        getColumnsCount: () => number;
        getRowsCount: () => number;
    }>;
};
declare const _default: React.ForwardRefExoticComponent<Props & React.RefAttributes<any>>;
export default _default;
