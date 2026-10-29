import type { ReactNode } from "react";
import type { NavBarItem } from "../src/NavBar/NavBar.types.js";
import { NavBar } from "../src/NavBar/NavBar.js";

const receptionItems: NavBarItem[] = [
  { name: "Nueva contraseña", link: "/receptions/new", loggedIn: true, selectedColor: "green" },
  { name: "Cierre de turno", link: "/cierre-turno", loggedIn: true },
  { name: "Contraseñas", link: "/receptions", loggedIn: true },
  { name: "Procesos", link: "/processes", loggedIn: true },
  {
    name: "Envíos",
    link: "/shipments",
    loggedIn: true,
    childrens: [
      { name: "Listado de envíos", link: "/shipments", loggedIn: true },
      { name: "Nuevo envío", link: "/shipments/new", loggedIn: true },
    ],
  },
];

const costItems: NavBarItem[] = [
  { name: "Configuración", link: "/configuration", loggedIn: true },
  { name: "Modificar costos", link: "/prices", loggedIn: true },
  { name: "Bitácora", link: "/history", loggedIn: true },
];

const Frame = ({ children }: { children: ReactNode }) => (
  <div className="-m-6 min-h-screen bg-slate-100">{children}</div>
);

export const RecepcionesSlate = () => (
  <Frame>
    <NavBar
      title="Recepción de Verduras"
      items={receptionItems}
      loggedIn
      selectedColor="slate"
      settingsOption
      reloadCatalogsOption
    />
  </Frame>
);

export const CostosGreen = () => (
  <Frame>
    <NavBar
      title="Costos de verduras"
      items={costItems}
      loggedIn
      selectedColor="green"
      settingsOption
    />
  </Frame>
);

export const CalidadYellow = () => (
  <Frame>
    <NavBar
      title="Control de calidad operativo"
      items={receptionItems.map((item) => ({ ...item, selectedColor: undefined }))}
      loggedIn
      selectedColor="yellow"
      settingsOption
      reloadCatalogsOption
    />
  </Frame>
);

export const LaboratorioSky = () => (
  <Frame>
    <NavBar
      title="Agri-Food Safety Lab"
      items={costItems}
      loggedIn
      selectedColor="sky"
      settingsOption
    />
  </Frame>
);

export const EnviosRed = () => (
  <Frame>
    <NavBar
      title="Envíos"
      items={receptionItems.filter((item) => item.name === "Envíos")}
      loggedIn
      selectedColor="red"
      settingsOption
      reloadCatalogsOption
    />
  </Frame>
);
