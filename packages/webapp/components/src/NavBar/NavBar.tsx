import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  DropDownArrowSvgIcon,
  ExitSvg,
  LogoutDropDownSvgIcon,
  MenuAlt4Svg,
  OpcionButtonSvgIcon,
} from "@zauru-sdk/icons";
import { COLORS } from "./NavBar.utils.js";
import type {
  ColorInterface,
  NavBarItem,
  NavBarProps,
} from "./NavBar.types.js";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useAppSelector } from "@zauru-sdk/redux";

type NavLayout = "desktop" | "mobile";

type UserMenuEntry = {
  key: string;
  label: string;
  to?: string;
  onClick?: () => void;
  icon?: ReactNode;
  danger?: boolean;
};

const itemColor = (
  item: Pick<NavBarItem, "selectedColor">,
  fallback: ColorInterface
): ColorInterface =>
  item.selectedColor ? COLORS[item.selectedColor] : fallback;

const visibleChildrenOf = (item: NavBarItem): NavBarItem[] =>
  (item.childrens ?? []).filter((child) => child.hide !== true);

const pathMatches = (pathname: string, link?: string) => {
  if (!link) return false;
  return pathname === link || pathname.startsWith(`${link}/`);
};

const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

const desktopTriggerClass = (color: ColorInterface, isActive: boolean) =>
  `inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-4 text-xs font-medium uppercase leading-none text-white transition-opacity duration-150 motion-reduce:transition-none ${
    isActive ? color.bg900 : color.bg700
  } hover:opacity-90 ${focusRing}`;

const mobileRowClass = (isActive: boolean) =>
  `flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-white transition-colors duration-150 motion-reduce:transition-none hover:bg-white/10 ${focusRing} ${
    isActive ? "bg-white/15" : ""
  }`;

const dropdownItemClass = (danger?: boolean) =>
  `flex min-h-11 w-full cursor-pointer items-center gap-2 px-4 text-sm transition-colors duration-150 motion-reduce:transition-none ${
    danger
      ? "text-red-700 hover:bg-red-50"
      : "text-gray-700 hover:bg-gray-100"
  }`;

const NotificationBadge = ({ value }: { value: string | number }) => (
  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
    {value}
  </span>
);

const useNotificationBadge = (item: NavBarItem) => {
  const relevantState = useAppSelector((state) =>
    item.reduxNotificationBadge
      ? item.reduxNotificationBadge(state)
      : undefined
  );
  const [notificationBadge, setNotificationBadge] = useState<
    undefined | string | number
  >();

  useEffect(() => {
    setNotificationBadge(relevantState);
  }, [relevantState]);

  return notificationBadge;
};

const Chevron = ({ open }: { open: boolean }) => (
  <span
    className={`inline-flex shrink-0 transition-transform duration-150 motion-reduce:transition-none ${
      open ? "rotate-180" : ""
    }`}
    aria-hidden="true"
  >
    <DropDownArrowSvgIcon />
  </span>
);

const NavLinkItem = ({
  item,
  color,
  layout,
  onNavigate,
}: {
  item: NavBarItem;
  color: ColorInterface;
  layout: NavLayout;
  onNavigate?: () => void;
}) => {
  const location = useLocation();
  const isActive = pathMatches(location.pathname, item.link);
  const notificationBadge = useNotificationBadge(item);
  const palette = itemColor(item, color);

  if (layout === "mobile") {
    return (
      <li>
        <Link
          to={item.link}
          aria-current={isActive ? "page" : undefined}
          onClick={onNavigate}
          className={`${mobileRowClass(isActive)} relative`}
        >
          {item.icon}
          <span className="flex-1">{item.name}</span>
          {notificationBadge !== undefined && (
            <NotificationBadge value={notificationBadge} />
          )}
        </Link>
      </li>
    );
  }

  return (
    <li className="relative">
      <Link
        to={item.link}
        aria-current={isActive ? "page" : undefined}
        className={`${desktopTriggerClass(palette, isActive)} relative`}
      >
        {item.icon}
        <span>{item.name}</span>
        {notificationBadge !== undefined && (
          <NotificationBadge value={notificationBadge} />
        )}
      </Link>
    </li>
  );
};

const NavItemGroup = ({
  item,
  color,
  layout,
  open,
  onToggle,
  onNavigate,
}: {
  item: NavBarItem;
  color: ColorInterface;
  layout: NavLayout;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) => {
  const location = useLocation();
  const children = visibleChildrenOf(item);
  const childActive = children.some((child) =>
    pathMatches(location.pathname, child.link)
  );
  const palette = itemColor(item, color);
  const menuId = useId();

  if (children.length === 0) {
    return null;
  }

  if (layout === "mobile") {
    return (
      <li>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={onToggle}
          className={mobileRowClass(childActive)}
        >
          {item.icon}
          <span className="flex-1">{item.name}</span>
          <Chevron open={open} />
        </button>
        <ul
          id={menuId}
          hidden={!open}
          className="mt-1 ml-3 space-y-1 border-l border-white/20 pl-2"
        >
          {children.map((child) => {
            const isActive = pathMatches(location.pathname, child.link);
            return (
              <li key={child.link}>
                <Link
                  to={child.link}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onNavigate}
                  className={mobileRowClass(isActive)}
                >
                  {child.icon}
                  <span>{child.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    );
  }

  return (
    <li className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onToggle}
        className={desktopTriggerClass(palette, childActive)}
      >
        {item.icon}
        <span>{item.name}</span>
        <Chevron open={open} />
      </button>
      <div
        id={menuId}
        role="menu"
        hidden={!open}
        className="absolute left-0 z-30 mt-2 min-w-[14rem] overflow-hidden rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5"
      >
        {children.map((child) => (
          <Link
            key={child.link}
            role="menuitem"
            to={child.link}
            onClick={onNavigate}
            className={dropdownItemClass()}
          >
            {child.icon}
            <span>{child.name}</span>
          </Link>
        ))}
      </div>
    </li>
  );
};

const UserMenu = ({
  color,
  layout,
  open,
  onToggle,
  onNavigate,
  entries,
}: {
  color: ColorInterface;
  layout: NavLayout;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  entries: UserMenuEntry[];
}) => {
  const menuId = useId();

  if (entries.length === 0) {
    return null;
  }

  if (layout === "mobile") {
    return (
      <div className="mt-4 border-t border-white/20 pt-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-white/70">
          Cuenta
        </p>
        <ul className="space-y-1">
          {entries.map((entry) => (
            <li key={entry.key}>
              {entry.to ? (
                <Link
                  to={entry.to}
                  onClick={onNavigate}
                  className={`${mobileRowClass(false)} [&_svg]:!text-current ${
                    entry.danger ? "text-red-100 hover:bg-red-500/20" : ""
                  }`}
                >
                  {entry.icon}
                  <span>{entry.label}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    entry.onClick?.();
                    onNavigate?.();
                  }}
                  className={`${mobileRowClass(false)} [&_svg]:!text-current`}
                >
                  {entry.icon}
                  <span>{entry.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative ml-auto">
      <button
        type="button"
        aria-label="Menú de usuario"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onToggle}
        className={`${desktopTriggerClass(color, open)} p-0 px-3`}
      >
        <OpcionButtonSvgIcon />
        <Chevron open={open} />
      </button>
      <div
        id={menuId}
        role="menu"
        hidden={!open}
        className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5"
      >
        {entries.map((entry) =>
          entry.to ? (
            <Link
              key={entry.key}
              role="menuitem"
              to={entry.to}
              onClick={onNavigate}
              className={dropdownItemClass(entry.danger)}
            >
              {entry.icon}
              <span>{entry.label}</span>
            </Link>
          ) : (
            <button
              key={entry.key}
              type="button"
              role="menuitem"
              onClick={() => {
                entry.onClick?.();
                onNavigate?.();
              }}
              className={dropdownItemClass(entry.danger)}
            >
              {entry.icon}
              <span>{entry.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

const NavItems = ({
  items,
  color,
  layout,
  openMenuId,
  setOpenMenuId,
  onNavigate,
}: {
  items: NavBarItem[];
  color: ColorInterface;
  layout: NavLayout;
  openMenuId: string | null;
  setOpenMenuId: Dispatch<SetStateAction<string | null>>;
  onNavigate?: () => void;
}) => (
  <ul
    className={
      layout === "mobile"
        ? "flex flex-col gap-1"
        : "flex flex-wrap items-center gap-1"
    }
  >
    {items.map((item, index) => {
      const children = visibleChildrenOf(item);
      const menuKey = `${item.name}-${index}`;
      if (children.length > 0) {
        return (
          <NavItemGroup
            key={menuKey}
            item={item}
            color={color}
            layout={layout}
            open={openMenuId === menuKey}
            onToggle={() =>
              setOpenMenuId((current) => (current === menuKey ? null : menuKey))
            }
            onNavigate={onNavigate}
          />
        );
      }
      return (
        <NavLinkItem
          key={menuKey}
          item={item}
          color={color}
          layout={layout}
          onNavigate={onNavigate}
        />
      );
    })}
  </ul>
);

export const NavBar = ({
  title,
  loggedIn,
  items,
  selectedColor,
  version,
  reloadCatalogsOption,
  settingsOption,
  showDarkModeToggle = false,
}: NavBarProps) => {
  const color: ColorInterface = COLORS[selectedColor];
  const [navOpen, setNavOpen] = useState(false);
  const [desktopMenuId, setDesktopMenuId] = useState<string | null>(null);
  const [mobileAccordionId, setMobileAccordionId] = useState<string | null>(
    null
  );
  const [currentVersion, setCurrentVersion] = useState(version);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const wasNavOpen = useRef(false);
  const mobileNavId = useId();

  const visibleItems = useMemo(
    () =>
      items.filter((item) => item.loggedIn === loggedIn && item.hide !== true),
    [items, loggedIn]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (version !== currentVersion) {
      setCurrentVersion(version);
    }
  }, [version, currentVersion]);

  useEffect(() => {
    setNavOpen(false);
    setDesktopMenuId(null);
    setMobileAccordionId(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!navOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [navOpen]);

  useEffect(() => {
    const drawer = mobileDrawerRef.current;
    if (!drawer) return;
    if (navOpen) {
      drawer.removeAttribute("inert");
    } else {
      drawer.setAttribute("inert", "");
    }
  }, [navOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setNavOpen(false);
      setDesktopMenuId(null);
      setMobileAccordionId(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!desktopMenuId) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (mobileDrawerRef.current?.contains(target)) return;
      if (desktopMenuRef.current?.contains(target)) return;
      setDesktopMenuId(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [desktopMenuId]);

  const closeMenus = () => {
    setNavOpen(false);
    setDesktopMenuId(null);
    setMobileAccordionId(null);
  };

  const onLinkNavigate = () => {
    window.setTimeout(closeMenus, 0);
  };

  const userEntries = useMemo<UserMenuEntry[]>(() => {
    if (!loggedIn) return [];
    const entries: UserMenuEntry[] = [];
    if (settingsOption) {
      entries.push({
        key: "configuracion",
        label: "Configuración",
        to: "/configuracion",
        icon: (
          <svg
            className="h-5 w-5 shrink-0"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
            <path d="M19.4 13a7.7 7.7 0 0 0 .06-2l2.1-1.64-2-3.46-2.55 1a7.7 7.7 0 0 0-1.73-1L14.7 2H9.3l-.58 2.9a7.7 7.7 0 0 0-1.73 1l-2.55-1-2 3.46L4.54 11a7.7 7.7 0 0 0 0 2l-2.1 1.64 2 3.46 2.55-1a7.7 7.7 0 0 0 1.73 1L9.3 22h5.4l.58-2.9a7.7 7.7 0 0 0 1.73-1l2.55 1 2-3.46Z" />
          </svg>
        ),
      });
    }
    if (reloadCatalogsOption) {
      entries.push({
        key: "recargar-catalogos",
        label: "Recargar catálogos",
        to: "/reload-catalogs",
        icon: (
          <svg
            className="h-5 w-5 shrink-0"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20.5 8c-1.392-3.179-4.823-5-8.522-5C7.299 3 3.453 6.552 3 11.1" />
            <path d="M16.489 8.4h3.97A.54.54 0 0 0 21 7.86V3.9M3.5 16c1.392 3.179 4.823 5 8.522 5 4.679 0 8.525-3.552 8.978-8.1" />
            <path d="M7.511 15.6h-3.97a.54.54 0 0 0-.541.54v3.96" />
          </svg>
        ),
      });
    }
    if (showDarkModeToggle) {
      entries.push({
        key: "dark-mode-toggle",
        label: isDarkMode ? "Modo claro" : "Modo oscuro",
        onClick: () => setIsDarkMode((value) => !value),
      });
    }
    entries.push({
      key: "cerrar-sesion",
      label: "Cerrar sesión",
      to: "/logout",
      icon: <LogoutDropDownSvgIcon />,
      danger: true,
    });
    return entries;
  }, [
    loggedIn,
    settingsOption,
    reloadCatalogsOption,
    showDarkModeToggle,
    isDarkMode,
  ]);

  useEffect(() => {
    const justOpened = navOpen && !wasNavOpen.current;
    wasNavOpen.current = navOpen;
    if (!justOpened) return;
    const activeGroup = visibleItems.find((item) =>
      visibleChildrenOf(item).some((child) =>
        pathMatches(location.pathname, child.link)
      )
    );
    if (!activeGroup) return;
    const index = visibleItems.indexOf(activeGroup);
    setMobileAccordionId(`${activeGroup.name}-${index}`);
  }, [navOpen, visibleItems, location.pathname]);

  const renderCluster = (layout: NavLayout) => {
    const isMobile = layout === "mobile";
    return (
      <>
        <NavItems
          items={visibleItems}
          color={color}
          layout={layout}
          openMenuId={isMobile ? mobileAccordionId : desktopMenuId}
          setOpenMenuId={isMobile ? setMobileAccordionId : setDesktopMenuId}
          onNavigate={onLinkNavigate}
        />
        <UserMenu
          color={color}
          layout={layout}
          open={desktopMenuId === "user"}
          onToggle={() =>
            setDesktopMenuId((current) => (current === "user" ? null : "user"))
          }
          onNavigate={onLinkNavigate}
          entries={userEntries}
        />
      </>
    );
  };

  return (
    <nav className={`py-2 ${color.bg600}`} aria-label="Principal">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 lg:w-auto lg:flex-none">
          <Link
            className={`inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-2 truncate text-sm font-bold uppercase text-white ${focusRing}`}
            to="/home"
          >
            <img className="h-7 w-auto shrink-0" src="/logo.png" alt="" />
            <span className="truncate">{title}</span>
          </Link>
          {version !== currentVersion && (
            <button
              type="button"
              className={`shrink-0 cursor-pointer rounded-full px-3 py-2 text-xs text-white ${color.bg700} hover:opacity-90 ${focusRing}`}
              onClick={() => navigate(0)}
            >
              Actualizar versión
            </button>
          )}
          <button
            type="button"
            className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md text-white lg:hidden ${focusRing} ${
              navOpen ? "pointer-events-none invisible" : ""
            }`}
            aria-label="Abrir menú"
            aria-expanded={navOpen}
            aria-controls={mobileNavId}
            aria-hidden={navOpen}
            tabIndex={navOpen ? -1 : undefined}
            onClick={() => setNavOpen(true)}
          >
            <MenuAlt4Svg open={false} />
          </button>
        </div>

        {navOpen && (
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-40 cursor-pointer bg-black/40 lg:hidden"
            onClick={closeMenus}
          />
        )}

        <div
          ref={mobileDrawerRef}
          id={mobileNavId}
          aria-hidden={!navOpen}
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,86vw)] flex-col ${
            color.bg700
          } shadow-lg transition-transform duration-200 ease-out motion-reduce:transition-none lg:hidden ${
            navOpen ? "translate-x-0" : "pointer-events-none -translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/15 px-4 py-3">
            <p className="truncate text-sm font-bold uppercase text-white">
              {title}
            </p>
            <button
              type="button"
              className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md text-white ${focusRing}`}
              aria-label="Cerrar menú"
              onClick={closeMenus}
            >
              <ExitSvg />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-3">
            {renderCluster("mobile")}
          </div>
        </div>

        <div
          ref={desktopMenuRef}
          className="hidden min-w-0 flex-1 items-center gap-2 lg:flex"
        >
          {renderCluster("desktop")}
        </div>
      </div>
    </nav>
  );
};
