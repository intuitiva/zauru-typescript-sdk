"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zendesk = exports.ZendeskAPI = exports.logoutFromZendesk = void 0;
const react_1 = require("react");
const canUseDOM = () => {
    if (typeof window === "undefined" ||
        !window.document ||
        !window.document.createElement) {
        return false;
    }
    return true;
};
const logoutFromZendesk = () => {
    if (canUseDOM() && window.zE) {
        window.zE("messenger", "logoutUser");
    }
    else {
        console.warn("Zendesk is not initialized yet");
    }
};
exports.logoutFromZendesk = logoutFromZendesk;
const ZendeskAPI = (...args) => {
    if (canUseDOM() && window.zE) {
        window.zE.apply(null, args);
    }
    else {
        console.warn("Zendesk is not initialized yet");
    }
};
exports.ZendeskAPI = ZendeskAPI;
const Zendesk = (props) => {
    const { defer, configuration, token, ...other } = props;
    (0, react_1.useEffect)(() => {
        const insertScript = () => {
            const zendeskScript = document.createElement("script");
            if (defer) {
                zendeskScript.defer = true;
            }
            else {
                zendeskScript.async = true;
            }
            zendeskScript.id = "ze-snippet";
            zendeskScript.src = `https://static.zdassets.com/ekr/snippet.js?key=${configuration.zendeskChatKey}`;
            zendeskScript.addEventListener("load", () => {
                if (props.onLoaded) {
                    props.onLoaded();
                }
                window.zE("messenger", "loginUser", function (callback) {
                    callback(token);
                });
            });
            document.body.appendChild(zendeskScript);
            return zendeskScript; // Devolvemos la referencia del script
        };
        let script; // Guardamos la referencia del script aquí
        if (canUseDOM() && !window.zE) {
            script = insertScript();
            window.zESettings = other;
        }
        return () => {
            if (script) {
                // Si el script existe, lo eliminamos del DOM
                script.remove();
            }
        };
    }, [props, defer, other, configuration, token]);
    return null;
};
exports.Zendesk = Zendesk;
