import { Tabs } from "../src/Tab/Tab.js";

export const Default = () => (
  <Tabs
    items={[
      { title: "General", link: "/" },
      { title: "Detalle", link: "/home" },
    ]}
  />
);
