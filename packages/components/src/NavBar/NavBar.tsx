import React, { useState } from "react";
import {
  DropDownArrowSvgIcon,
  LogoutDropDownSvgIcon,
  MenuAlt4Svg,
  OpcionButtonSvgIcon,
} from "@zauru-sdk/icons";
import { COLORS } from "./NavBar.utils";
import type {
  ColorInterface,
  DropDownLinkButtonType,
  EntityProps,
  NavBarProps,
  NavItemProps,
} from "./NavBar.types";
import { Link } from "@remix-run/react";

const DropDownLinkButton = ({
  text,
  path,
  icon,
  buttonHover,
}: DropDownLinkButtonType) => (
  <Link
    className={`block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 ${
      buttonHover ?? ""
    } dark:hover:bg-gray-700 dark:hover:text-white`}
    to={path}
    prefetch="none"
  >
    <div className="mx-auto pt-2">
      {icon}
      <span>{text}</span>
    </div>
  </Link>
);

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
            {options.map((option) => option)}
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
  color,
  specialColor,
  childrens = [],
}: NavItemProps) => (
  <li className="nav-item">
    {childrens.length > 0 ? (
      <OptionsDropDownButton
        name={name}
        color={color}
        options={childrens.map((x, index) => (
          <DropDownLinkButton
            key={index}
            text={x.name}
            path={x.link}
            buttonHover="hover:bg-red-100"
          />
        ))}
      />
    ) : (
      <div
        className={`${
          specialColor ? specialColor.bg700 : color.bg700
        } container text-white w-56 sm:w-auto h-10 text-sm py-1 uppercase rounded shadow hover:shadow-lg outline-none rounded-full focus:outline-none my-auto sm:my-0 sm:mr-1 mb-1 ease-linear transition-all duration-150 `}
      >
        <Link
          className="px-3 flex items-center text-xs leading-snug text-white uppercase hover:opacity-75"
          to={link}
          prefetch="none"
        >
          <div className="mx-auto pt-2">
            {icon}
            <span>{name}</span>
          </div>
        </Link>
      </div>
    )}
  </li>
);

export const NavBar = ({
  title,
  loggedIn,
  items,
  selectedColor,
}: NavBarProps) => {
  const color: ColorInterface = COLORS[selectedColor];
  const [NavBarOpen, setNavBarOpen] = useState(false);

  const options = (
    <>
      <ul>
        {loggedIn && (
          <div className="flex flex-col sm:flex-row ">
            {items
              .filter((item) => item.loggedIn)
              .map((item, index) => {
                const specialColor: ColorInterface | undefined = item.color
                  ? COLORS[item.color]
                  : undefined;
                return (
                  <NavItem
                    key={index}
                    name={item.name}
                    link={item.link}
                    icon={item.icon}
                    specialColor={specialColor}
                    color={color}
                    childrens={item.childrens?.map((x) => {
                      return { ...x } as any;
                    })}
                  />
                );
              })}
          </div>
        )}
      </ul>
      <ul className="sm:flex sm:flex-col ml-auto lg:flex-row">
        {loggedIn ? (
          <OptionsDropDownButton
            color={color}
            options={[
              <DropDownLinkButton
                key={0}
                text="Cerrar Sesión"
                path="/logout"
                icon={<LogoutDropDownSvgIcon />}
                buttonHover="hover:bg-red-100"
              />,
            ]}
          />
        ) : (
          items
            .filter((item) => !item.loggedIn)
            .map((item, index) => {
              return (
                <NavItem
                  key={index}
                  name={item.name}
                  link={item.link}
                  icon={item.icon}
                  color={color}
                />
              );
            })
        )}
      </ul>
    </>
  );

  return (
    <nav className={`py-3 ${color.bg600}`}>
      <div className="flex items-center justify-between ml-5 mr-5">
        <div className="flex justify-between w-full lg:w-auto">
          <Link
            className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
            to={"/home"}
            prefetch="none"
            children={
              <>
                <div className="inline-block mr-2 mb-2 align-middle">
                  <img
                    className="w-auto h-7"
                    src="/logo.png"
                    alt="logo-zauru"
                  />
                </div>
                {title}
              </>
            }
          />
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
          className={`lg:hidden absolute top-0 left-0 z-50 w-64 h-full ${
            color.bg700
          } shadow-lg transform ${
            NavBarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          {options}
        </div>
        {/* Menú para escritorio */}
        <div className="hidden lg:flex w-full lg:w-auto">{options}</div>
      </div>
    </nav>
  );
};
