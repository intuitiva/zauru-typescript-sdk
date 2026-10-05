import type { ReactNode } from "react";
import { MainContainer } from "../Containers/MainContainer.js";
import { SubContainer } from "../Containers/SubContainer.js";
import { RouteTabNav } from "./RouteTabNav.js";

type Props = {
  children: ReactNode;
  showEmployees?: boolean;
  showRoles?: boolean;
  showPermissions?: boolean;
  basePath?: string;
  title?: string;
  description?: string;
};

export const WebappSettingsChrome = ({
  children,
  showEmployees = true,
  showRoles = true,
  showPermissions = true,
  basePath = "/configuracion",
  title = "Configuración",
  description = "Roles, empleados y permisos de esta aplicación.",
}: Props) => {
  const base = basePath.replace(/\/$/, "");
  return (
    <MainContainer>
      <SubContainer title={title} description={description}>
        <RouteTabNav
          ariaLabel="Secciones de configuración de accesos"
          selectedColor="indigo"
          items={[
            {
              to: `${base}/empleados`,
              label: "Empleados",
              hide: !showEmployees,
            },
            {
              to: `${base}/roles`,
              label: "Roles",
              hide: !showRoles,
            },
            {
              to: `${base}/permisos`,
              label: "Permisos",
              hide: !showPermissions,
            },
          ]}
        />
        {children}
      </SubContainer>
    </MainContainer>
  );
};
