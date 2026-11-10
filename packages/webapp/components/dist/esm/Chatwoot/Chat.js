import { useEffect } from "react";
const SCRIPT_ID = "chatwoot-sdk";
const DEFAULT_BASE_URL = "https://soporte.zauru.com";
const canUseDOM = () => typeof window !== "undefined" &&
    Boolean(window.document?.createElement);
function getChatwootWindow() {
    if (!canUseDOM())
        return null;
    return window;
}
function compactAttributes(attrs) {
    if (!attrs)
        return {};
    const next = {};
    for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === undefined || value === "")
            continue;
        next[key] = value;
    }
    return next;
}
function identifyUser(user, identifierHash, locale) {
    const $chatwoot = getChatwootWindow()?.$chatwoot;
    if (!$chatwoot)
        return;
    const payload = {};
    if (user.email)
        payload.email = user.email;
    if (user.name)
        payload.name = user.name;
    if (user.companyName)
        payload.company_name = user.companyName;
    if (user.avatarUrl)
        payload.avatar_url = user.avatarUrl;
    if (identifierHash)
        payload.identifier_hash = identifierHash;
    $chatwoot.setUser(user.identifier, payload);
    const custom = compactAttributes(user.customAttributes);
    if (Object.keys(custom).length > 0) {
        $chatwoot.setCustomAttributes(custom);
    }
    $chatwoot.setLocale?.(locale);
}
function removeWidgetDom(baseUrl) {
    const doc = getChatwootWindow()?.document;
    if (!doc)
        return;
    doc.getElementById(SCRIPT_ID)?.remove();
    doc
        .querySelectorAll(`script[src*="${baseUrl}/packs/js/sdk.js"], iframe#chatwoot_live_chat_widget, .woot-widget-holder, .woot-widget-bubble`)
        .forEach((el) => el.remove());
}
export function resetChatwoot() {
    const w = getChatwootWindow();
    if (!w)
        return;
    try {
        w.$chatwoot?.reset();
    }
    catch {
        // Widget may already be gone during logout navigation.
    }
}
export function ChatwootWidget({ websiteToken, baseUrl = DEFAULT_BASE_URL, identifierHash, user, locale = "es", position = "right", darkMode = "auto", }) {
    const identifier = user.identifier;
    const email = user.email;
    const name = user.name;
    const companyName = user.companyName;
    const avatarUrl = user.avatarUrl;
    const customAttributesKey = JSON.stringify(compactAttributes(user.customAttributes));
    useEffect(() => {
        const w = getChatwootWindow();
        if (!w || !websiteToken || !identifier)
            return;
        w.chatwootSettings = {
            hideMessageBubble: false,
            position,
            locale,
            useBrowserLanguage: false,
            type: "standard",
            darkMode,
        };
        const onReady = () => {
            identifyUser({
                identifier,
                email,
                name,
                companyName,
                avatarUrl,
                customAttributes: JSON.parse(customAttributesKey),
            }, identifierHash, locale);
        };
        w.addEventListener("chatwoot:ready", onReady);
        const existing = w.document.getElementById(SCRIPT_ID);
        if (w.$chatwoot) {
            onReady();
        }
        else if (!existing) {
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
        customAttributesKey,
        locale,
        position,
        darkMode,
    ]);
    useEffect(() => {
        return () => {
            resetChatwoot();
            removeWidgetDom(baseUrl);
            const w = getChatwootWindow();
            if (w) {
                delete w.chatwootSDK;
                delete w.$chatwoot;
            }
        };
    }, [baseUrl]);
    return null;
}
export const Chatwoot = ChatwootWidget;
