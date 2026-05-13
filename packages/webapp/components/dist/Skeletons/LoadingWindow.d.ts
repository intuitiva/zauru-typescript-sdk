import React from "react";
interface LoadingItem {
    name: string;
    loading: boolean;
}
interface LoadingWindowProps {
    loadingItems?: LoadingItem[];
    description?: string;
}
export declare const LoadingWindow: React.FC<LoadingWindowProps>;
export default LoadingWindow;
