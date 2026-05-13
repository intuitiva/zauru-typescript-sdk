/**
 * Universal fields every Appocus app needs to white-label.
 * Domain-specific copy (e.g. invoice / catalog terminology) is left to each app
 * via TypeScript declaration merging or a typed extension that satisfies this shape.
 */
export type AppocusAppMeta = {
  title: string;
  description: string;
  shortName: string;
  /** `<html lang>` */
  htmlLang: string;
  /** PWA / locale */
  lang: string;
  hydrateTitle: string;
  hydrateSubtitle: string;
  /** `{year}` replaced at render */
  footerCopyright: string;
  loadingOverlay: string;
};

export type AppocusAssets = {
  logo: string;
  logoDark: string;
  loginHero: string;
  notFound: string;
  defaultAvatar: string;
  imageNotFound: string;
};

export type AppocusSupport = {
  accountRequestMailtoHref: string;
};

export type AppocusOauth = {
  /** Window name used by `requestReauthInPopup`. Use a per-app slug. */
  reauthPopupWindowName: string;
};

export type AppocusPwa = {
  description: string;
  backgroundColor: string;
  themeColor: string;
  orientation: string;
  categories: string[];
};

export type AppocusLogin = {
  defaultTitle: string;
  loadingText: string;
  buttonText: string;
  accountPrompt: string;
  accountLinkLabel: string;
  logoAlt: string;
  heroAlt: string;
};

export type AppocusNotFoundCopy = {
  imageAlt: string;
  heading: string;
  description: string;
  homeCta: string;
  loginCta: string;
  errorCode: string;
};

export type BaseAppocusCopy = {
  notFoundPage: AppocusNotFoundCopy;
  error404InRoot: AppocusNotFoundCopy;
};

export type BaseAppocusConfig = {
  app: AppocusAppMeta;
  assets: AppocusAssets;
  support: AppocusSupport;
  oauth: AppocusOauth;
  pwa: AppocusPwa;
  login: AppocusLogin;
  copy: BaseAppocusCopy;
};

/**
 * Identity helper that gives a typed config object back. Apps typically extend
 * `BaseAppocusConfig` with their own `copy` keys and pass the merged object.
 */
export function defineAppocusConfig<T extends BaseAppocusConfig>(cfg: T): T {
  return cfg;
}
