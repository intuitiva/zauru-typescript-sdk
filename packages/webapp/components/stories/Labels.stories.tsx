import { InfoLabel } from "../src/Labels/InfoLabel/index.js";
import { SearchFiltersSummary } from "../src/Labels/SearchFiltersSummary.js";

export const Info = () => (
  <InfoLabel title="Agencia" description="Central" />
);

export const Filters = () => (
  <SearchFiltersSummary
    items={[
      { key: "dates", label: "Fechas", value: "01/01/2026 – 31/01/2026" },
      { key: "agency", label: "Agencia", value: "Todas" },
    ]}
  />
);

export const FiltersEmpty = () => <SearchFiltersSummary items={[]} />;
