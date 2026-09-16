export declare const ErrorLayout: ({ from, isRootLevel, error: parentError, onError, reportErrors, }: {
    from?: string;
    isRootLevel?: boolean;
    error?: Error;
    onError?: (error: Error, meta: {
        from?: string;
    }) => void;
    /** Default true. POSTs to `/api/client-errors` unless `onError` is passed. */
    reportErrors?: boolean;
}) => import("react/jsx-runtime").JSX.Element | null;
