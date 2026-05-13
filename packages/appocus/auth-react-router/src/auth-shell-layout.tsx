import * as React from "react";

/**
 * Standard wrapper used by the auth pages: muted-background, vertically centered,
 * responsive max-width column. Pure layout — does not depend on any specific
 * design-system primitives.
 */
export function AuthShellLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className={className ?? "w-full max-w-sm md:max-w-4xl"}>
        {children}
      </div>
    </div>
  );
}
