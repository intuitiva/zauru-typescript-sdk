import { ErrorLayout } from "../Layouts/errorLayout/index.js";
import { HomeLayout } from "../Layouts/homeLayout/index.js";
import type { ZauruHomeLayoutColor } from "./ZauruLoginPage.js";

export type ZauruIndexPageProps = {
  title: string;
  description?: string;
  color?: ZauruHomeLayoutColor;
};

export function ZauruIndexPage({
  title,
  description = "Inicie sesión para poder continuar.",
  color,
}: ZauruIndexPageProps) {
  try {
    return <HomeLayout title={title} description={description} color={color} />;
  } catch (error: any) {
    return <ErrorLayout from="/index.tsx" error={error} isRootLevel={false} />;
  }
}
