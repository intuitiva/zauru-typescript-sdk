import { Container } from "../src/Containers/Container.js";
import { Button } from "../src/Buttons/Button.js";

export const Default = () => (
  <Container title="Contenedor" description="Descripción de la sección.">
    <p>Contenido de ejemplo.</p>
  </Container>
);

export const WithRightContent = () => (
  <Container
    title="Con acciones"
    description="El encabezado se adapta en móvil."
    rightContent={<Button title="Nuevo" />}
  >
    <p>Cuerpo.</p>
  </Container>
);

export const Collapsible = () => (
  <Container title="Colapsable" collapsible defaultOpen>
    <p>Se puede contraer con el summary.</p>
  </Container>
);
