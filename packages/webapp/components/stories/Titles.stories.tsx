import { TitleH1 } from "../src/Titles/TitleH1.js";
import { TitleH2 } from "../src/Titles/TitleH2.js";
import { TitleH3 } from "../src/Titles/TitleH3.js";

export const Hierarchy = () => (
  <div className="space-y-3">
    <TitleH1 texto="Título H1" />
    <TitleH2 texto="Título H2" />
    <TitleH3 texto="Título H3" />
  </div>
);
