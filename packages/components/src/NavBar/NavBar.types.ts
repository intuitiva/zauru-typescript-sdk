export type NavBarItem = {
  name: string;
  link: string;
  loggedIn: boolean;
  icon?: any;
  selectedColor?: "green";
  color?: ColorInterface;
  childrens?: Exclude<NavBarItem, "loggedIn">[];
  reduxNotificationBadge?: (state: any) => string | number;
};

export type NavBarProps = {
  title: string;
  loggedIn: boolean;
  items: Array<NavBarItem>;
  selectedColor:
    | "pink"
    | "purple"
    | "slate"
    | "green"
    | "yellow"
    | "red"
    | "sky";
  LinkComponent?: any;
  version?: string;
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

export type EntityNameType = {
  entityName: string;
};

export type EntityProps = {
  name?: string;
  color: ColorInterface;
  options: any[];
  specialColor?: ColorInterface;
};
