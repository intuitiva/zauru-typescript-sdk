import React, { useState, useEffect } from "react";
import {
  DropDownArrowSvgIcon,
  LogoutDropDownSvgIcon,
  MenuAlt4Svg,
  OpcionButtonSvgIcon,
} from "@zauru-sdk/icons";
import { COLORS } from "./NavBar.utils.js";
import type {
  ColorInterface,
  EntityProps,
  NavBarItem,
  NavBarProps,
} from "./NavBar.types.js";
import { Link, useNavigate, useLocation } from "@remix-run/react";
import { useAppSelector } from "@zauru-sdk/redux";

const OptionsDropDownButton = ({ color, options, name }: EntityProps) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(true);

  return (
    <div className="nav-item ml-auto">
      <div className="flex justify-center">
        <div className="relative inline-block">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className={`relative flex items-center p-2 text-xs text-white ${color.bg700} active:${color.bg900} border border-transparent rounded-full uppercase focus:ring-opacity-40 focus:outline-none`}
          >
            {name ?? <OpcionButtonSvgIcon />}
            <DropDownArrowSvgIcon />
          </button>
          <div
            className="absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800"
            hidden={showOptionsMenu}
            onMouseLeave={() => setShowOptionsMenu(true)}
          >
            {options.map((option, index) => (
              <React.Fragment key={index}>{option}</React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({
  name,
  link,
  icon,
  selectedColor,
  childrens = [],
  reduxNotificationBadge,
}: NavBarItem) => {
  const location = useLocation();
  const isActive = location.pathname === link;

  const specialColor: ColorInterface = selectedColor
    ? COLORS[selectedColor]
    : COLORS["slate"];

  // Selecciona solo la parte del estado relevante
  const relevantState = useAppSelector((state) =>
    reduxNotificationBadge ? reduxNotificationBadge(state) : undefined
  );

  const [notificationBadge, setNotificationBadge] = useState<
    undefined | string | number
  >();

  useEffect(() => {
    setNotificationBadge(relevantState);
  }, [relevantState]);

  // Si este NavItem tiene elementos hijos, renderiza el botón desplegable:
  if (childrens.length > 0) {
    return (
      <OptionsDropDownButton
        name={name}
        color={specialColor}
        options={childrens.map((x, index) => (
          <Link
            key={index}
            to={x.link}
            className={`block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 dark:hover:text-white`}
          >
            {x.name}
          </Link>
        ))}
      />
    );
  }

  // Si NO tiene elementos hijos, se renderiza como un ítem simple:
  return (
    <li className="nav-item relative">
      <div
        // Si está activo, usamos color de fondo más oscuro (bg900)
        // De lo contrario, usamos el color normal (bg700)
        className={`${
          isActive ? specialColor.bg900 : specialColor.bg700
        } container text-white w-full sm:w-auto h-10 text-sm py-1 uppercase shadow hover:shadow-lg outline-none rounded-full focus:outline-none my-auto sm:my-0 sm:mr-1 mb-1 ease-linear transition-all duration-150`}
      >
        <Link
          className="px-3 flex items-center text-xs leading-snug text-white uppercase hover:opacity-75 relative"
          to={link}
        >
          <div className="mx-auto pt-2">
            {icon}
            <span>{name}</span>
          </div>
          {/* Badge de notificaciones */}
          {notificationBadge !== undefined && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center w-5 h-5">
              {notificationBadge}
            </span>
          )}
        </Link>
      </div>
    </li>
  );
};

export const NavBar = ({
  title,
  loggedIn,
  items,
  selectedColor,
  version,
}: NavBarProps) => {
  const color: ColorInterface = COLORS[selectedColor];
  const [NavBarOpen, setNavBarOpen] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(version);
  const navigate = useNavigate();

  useEffect(() => {
    if (version !== currentVersion) {
      setCurrentVersion(version);
    }
  }, [version, currentVersion]);

  const refreshPage = () => {
    navigate(0);
  };

  const renderNavItems = (items: NavBarItem[]) => (
    <div className="flex flex-col lg:flex-row w-full">
      {items.map((item, index) => {
        return (
          <NavItem
            key={index}
            name={item.name}
            link={item.link}
            icon={item.icon}
            selectedColor={item.selectedColor}
            color={color}
            loggedIn={item.loggedIn}
            reduxNotificationBadge={item.reduxNotificationBadge}
            childrens={item.childrens?.map((x) => {
              return { ...x } as any;
            })}
          />
        );
      })}
    </div>
  );

  const options = (
    <>
      <ul className="w-full lg:flex lg:items-center">
        {renderNavItems(items.filter((item) => item.loggedIn === loggedIn))}
      </ul>
      <ul className="sm:flex sm:flex-col lg:flex-row ml-auto">
        {loggedIn && (
          <OptionsDropDownButton
            color={color}
            options={[
              <Link
                key="cerrar-sesion"
                className={`block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700 dark:hover:text-white`}
                to="/logout"
              >
                <div className="mx-auto pt-2">
                  {<LogoutDropDownSvgIcon />}
                  <span>Cerrar sesión</span>
                </div>
              </Link>,
            ]}
          />
        )}
      </ul>
    </>
  );

  return (
    <nav className={`py-3 ${color.bg600}`}>
      <div className="flex items-center justify-between ml-5 mr-5">
        <div className="flex justify-between items-center w-full lg:w-auto">
          <Link
            className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
            to={"/home"}
          >
            <div className="inline-block mr-2 mb-2 align-middle">
              <img className="w-auto h-7" src="/logo.png" alt="logo-zauru" />
            </div>
            {title}
          </Link>
          {version !== currentVersion && (
            <button
              className={`ml-2 px-2 py-1 text-xs text-white ${color.bg700} rounded-full hover:${color.bg900} transition-colors duration-200`}
              onClick={refreshPage}
            >
              🔄 Actualizar versión
            </button>
          )}
          <button
            className={`rounded lg:hidden focus:outline-none focus:ring focus:${color.ring600} focus:ring-opacity-50`}
            aria-label="Toggle mobile menu"
            type="button"
            onClick={() => setNavBarOpen(!NavBarOpen)}
          >
            <MenuAlt4Svg open={NavBarOpen} />
          </button>
        </div>
        {/* Menú para dispositivos móviles */}
        <div
          className={`lg:hidden fixed top-0 left-0 z-50 w-64 h-full ${
            color.bg700
          } dark:bg-gray-900 shadow-lg transform ${
            NavBarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="p-4">{options}</div>
        </div>
        {/* Menú para escritorio */}
        <div className="hidden lg:flex lg:items-center w-full lg:w-auto">
          {options}
        </div>
      </div>
    </nav>
  );
};
