export type NavBarItemsSchema = {
  name: string;
  link: string;
  loggedIn: boolean;
  icon?: any;
  color?: "green";
  childrens?: Exclude<NavBarItemsSchema, "loggedIn">[];
};

export type NavBarProps = {
  title: string;
  loggedIn: boolean;
  items: Array<NavBarItemsSchema>;
  selectedColor:
    | "pink"
    | "purple"
    | "slate"
    | "green"
    | "yellow"
    | "red"
    | "sky";
  LinkComponent?: any;
};

export type NavBarStateProps = {
  NavBarOpen: boolean;
  setNavBarOpen?: any;
};

export type ColorInterface = {
  bg900: string;
  bg700: string;
  bg600: string;
  bg500: string;
  ring600: string;
  ring500: string;
};

export type NavItemProps = {
  name: string;
  link: string;
  icon?: any;
  color: ColorInterface;
  specialColor?: ColorInterface;
  childrens?: Exclude<NavItemProps, "index" | "color">[];
};

export type EntityNameType = {
  entityName: string;
};

export type EntityProps = {
  name?: string;
  color: ColorInterface;
  options: any[];
};
