import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Standard wrapper used by the auth pages: muted-background, vertically centered,
 * responsive max-width column. Pure layout — does not depend on any specific
 * design-system primitives.
 */
export function AuthShellLayout({ children, className, }) {
    return (_jsx("div", { className: "bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10", children: _jsx("div", { className: className ?? "w-full max-w-sm md:max-w-4xl", children: children }) }));
}
