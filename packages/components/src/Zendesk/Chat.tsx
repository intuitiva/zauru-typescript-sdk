import { useEffect } from "react";

const canUseDOM = (): boolean => {
  if (
    typeof window === "undefined" ||
    !window.document ||
    !window.document.createElement
  ) {
    return false;
  }
  return true;
};

export const logoutFromZendesk = () => {
  if (canUseDOM() && (window as any).zE) {
    (window as any).zE("messenger", "logoutUser");
  } else {
    console.warn("Zendesk is not initialized yet");
  }
};

export const ZendeskAPI = (...args: any[]) => {
  if (canUseDOM() && (window as any).zE) {
    (window as any).zE.apply(null, args);
  } else {
    console.warn("Zendesk is not initialized yet");
  }
};

interface ZendeskProps {
  defer?: boolean;
  onLoaded?: () => void;
  token: string;
  configuration: {
    zendeskChatKey: string;
  };
  [key: string]: any; // Para propiedades adicionales que se pasen y se asignen a window.zESettings
}

export const Zendesk: React.FC<ZendeskProps> = (props: ZendeskProps) => {
  const { defer, configuration, token, ...other } = props;

  useEffect(() => {
    const insertScript = () => {
      const zendeskScript = document.createElement("script");
      if (defer) {
        zendeskScript.defer = true;
      } else {
        zendeskScript.async = true;
      }
      zendeskScript.id = "ze-snippet";
      zendeskScript.src = `https://static.zdassets.com/ekr/snippet.js?key=${configuration.zendeskChatKey}`;
      zendeskScript.addEventListener("load", () => {
        if (props.onLoaded) {
          props.onLoaded();
        }

        (window as any).zE("messenger", "loginUser", function (callback: any) {
          callback(token);
        });
      });
      document.body.appendChild(zendeskScript);

      return zendeskScript; // Devolvemos la referencia del script
    };

    let script: HTMLScriptElement | undefined; // Guardamos la referencia del script aquí

    if (canUseDOM() && !(window as any).zE) {
      script = insertScript();
      (window as any).zESettings = other;
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
