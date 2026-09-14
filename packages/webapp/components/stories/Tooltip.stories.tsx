import { Tooltip } from "../src/Tooltip/Tooltip.js";
import { WithTooltip } from "../src/WithTooltip/WithTooltip.js";
import { Button } from "../src/Buttons/Button.js";

export const HoverTooltip = () => (
  <Tooltip text="Ayuda contextual">
    <Button title="Pasa el mouse" type="button" />
  </Tooltip>
);

export const CssTooltip = () => (
  <WithTooltip text="Texto largo que se envuelve en el globo de ayuda.">
    <Button title="Con tooltip CSS" type="button" />
  </WithTooltip>
);
