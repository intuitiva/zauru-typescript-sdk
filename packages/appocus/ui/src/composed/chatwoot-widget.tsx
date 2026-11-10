import { useEffect } from "react";

const SCRIPT_ID = "chatwoot-sdk";
const DEFAULT_BASE_URL = "https://soporte.zauru.com";

const canUseDOM = (): boolean =>
  typeof window !== "undefined" && Boolean(window.document?.createElement);

export type ChatwootUser = {
  identifier: string;
  email?: string;
  name?: string;
  companyName?: string;
  avatarUrl?: string;
  description?: string;
  customAttributes?: Record<
    string,
    string | number | boolean | null | undefined
  >;
  conversationAttributes?: Record<
    string,
    string | number | boolean | null | undefined
  >;
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

type ChatwootSdk = {
  run: (opts: { websiteToken: string; baseUrl: string }) => void;
};

type ChatwootApi = {
  setUser: (identifier: string, user: Record<string, unknown>) => void;
  setCustomAttributes: (attrs: Record<string, unknown>) => void;
  setConversationCustomAttributes?: (attrs: Record<string, unknown>) => void;
  setLocale?: (locale: string) => void;
  reset: () => void;
};

type ChatwootWindow = Window & {
  chatwootSDK?: ChatwootSdk;
  $chatwoot?: ChatwootApi;
  chatwootSettings?: Record<string, unknown>;
};

function getChatwootWindow(): ChatwootWindow | null {
  if (!canUseDOM()) return null;
  return window as ChatwootWindow;
}

function compactAttributes(
  attrs: ChatwootUser["customAttributes"],
): Record<string, string | number | boolean> {
  if (!attrs) return {};
  const next: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === "") continue;
    next[key] = value;
  }
  return next;
}

function identifyUser(
  user: ChatwootUser,
  identifierHash: string | undefined,
  locale: string,
): void {
  const $chatwoot = getChatwootWindow()?.$chatwoot;
  if (!$chatwoot) return;

  const payload: Record<string, unknown> = {};
  if (user.email) payload.email = user.email;
  if (user.name) payload.name = user.name;
  if (user.companyName) payload.company_name = user.companyName;
  if (user.description) payload.description = user.description;
  if (user.avatarUrl?.startsWith("http")) payload.avatar_url = user.avatarUrl;
  if (identifierHash) payload.identifier_hash = identifierHash;

  $chatwoot.setUser(user.identifier, payload);

  const custom = compactAttributes(user.customAttributes);
  if (Object.keys(custom).length > 0) {
    $chatwoot.setCustomAttributes(custom);
  }

  const conversation = compactAttributes(user.conversationAttributes);
  if (Object.keys(conversation).length > 0) {
    $chatwoot.setConversationCustomAttributes?.(conversation);
  }

  $chatwoot.setLocale?.(locale);
}

export function resetChatwoot(): void {
  const w = getChatwootWindow();
  if (!w) return;
  try {
    w.$chatwoot?.reset();
  } catch {
    // Widget may already be gone during logout navigation.
  }
}

export function ChatwootWidget({
  websiteToken,
  baseUrl = DEFAULT_BASE_URL,
  identifierHash,
  user,
  locale = "es",
  position = "right",
  darkMode = "auto",
}: ChatwootWidgetProps) {
  const identifier = user.identifier;
  const email = user.email;
  const name = user.name;
  const companyName = user.companyName;
  const avatarUrl = user.avatarUrl;
  const description = user.description;
  const customAttributesKey = JSON.stringify(
    compactAttributes(user.customAttributes),
  );
  const conversationAttributesKey = JSON.stringify(
    compactAttributes(user.conversationAttributes),
  );

  useEffect(() => {
    const w = getChatwootWindow();
    if (!w || !websiteToken || !identifier || !identifierHash) return;

    w.chatwootSettings = {
      hideMessageBubble: false,
      position,
      locale,
      useBrowserLanguage: false,
      type: "standard",
      darkMode,
    };

    const onReady = () => {
      identifyUser(
        {
          identifier,
          email,
          name,
          companyName,
          avatarUrl,
          description,
          customAttributes: JSON.parse(
            customAttributesKey,
          ) as ChatwootUser["customAttributes"],
          conversationAttributes: JSON.parse(
            conversationAttributesKey,
          ) as ChatwootUser["conversationAttributes"],
        },
        identifierHash,
        locale,
      );
    };

    w.addEventListener("chatwoot:ready", onReady);

    const existing = w.document.getElementById(SCRIPT_ID);

    if (w.$chatwoot) {
      onReady();
    } else if (w.chatwootSDK) {
      w.chatwootSDK.run({ websiteToken, baseUrl });
    } else if (!existing) {
      const script = w.document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `${baseUrl}/packs/js/sdk.js`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        w.chatwootSDK?.run({ websiteToken, baseUrl });
      };
      w.document.body.appendChild(script);
    }

    return () => {
      w.removeEventListener("chatwoot:ready", onReady);
    };
  }, [
    websiteToken,
    baseUrl,
    identifierHash,
    identifier,
    email,
    name,
    companyName,
    avatarUrl,
    description,
    customAttributesKey,
    conversationAttributesKey,
    locale,
    position,
    darkMode,
  ]);

  return null;
}

export const Chatwoot = ChatwootWidget;
