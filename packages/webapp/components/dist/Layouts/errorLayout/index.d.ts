export declare const ErrorLayout: ({ from, isRootLevel, error: parentError, onError, }: {
    from?: string;
    isRootLevel?: boolean;
    error?: Error;
    onError?: (error: Error, meta: {
        from?: string;
    }) => void;
}) => import("react/jsx-runtime").JSX.Element | null;
