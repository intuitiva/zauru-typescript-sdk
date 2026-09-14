import { StaticAlert } from "../src/Alerts/StaticAlert.js";

export const Info = () => (
  <StaticAlert title="Información" description="Mensaje informativo." type="info" />
);

export const Success = () => (
  <StaticAlert title="Listo" description="La operación se completó." type="success" />
);

export const Warning = () => (
  <StaticAlert
    title="Atención"
    description="Hay datos pendientes de revisar."
    type="warning"
  />
);
