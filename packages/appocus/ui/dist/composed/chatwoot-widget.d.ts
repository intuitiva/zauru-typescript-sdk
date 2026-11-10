export type ChatwootUser = {
    identifier: string;
    email?: string;
    name?: string;
    companyName?: string;
    avatarUrl?: string;
    customAttributes?: Record<string, string | number | boolean | null | undefined>;
};
export type ChatwootWidgetProps = {
    websiteToken: string;
    baseUrl?: string;
    identifierHash?: string;
    user: ChatwootUser;
    locale?: string;
    position?: "left" | "right";
    darkMode?: "light" | "auto" | "dark";
};
export declare function resetChatwoot(): void;
export declare function ChatwootWidget({ websiteToken, baseUrl, identifierHash, user, locale, position, darkMode, }: ChatwootWidgetProps): null;
export declare const Chatwoot: typeof ChatwootWidget;
