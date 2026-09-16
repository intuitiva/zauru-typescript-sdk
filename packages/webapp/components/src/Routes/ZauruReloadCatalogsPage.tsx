import { useEffect, useState } from "react";
import { ErrorLayout } from "../Layouts/errorLayout/index.js";
import { LoadingWindow } from "../Skeletons/LoadingWindow.js";

export type ZauruReloadCatalogItem = {
  name: string;
  loading: boolean;
};

export type ZauruReloadCatalogsPageProps = {
  items: ZauruReloadCatalogItem[];
};

export function ZauruReloadCatalogsPage({
  items,
}: ZauruReloadCatalogsPageProps) {
  try {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      return <LoadingWindow />;
    }

    const loading = items.some((item) => item.loading);

    return (
      <LoadingWindow
        description={
          loading
            ? "Cargando catálogos..."
            : "Catálogos cargados correctamente ✅"
        }
        loadingItems={items}
      />
    );
  } catch (error: any) {
    return (
      <ErrorLayout from="/reload-catalogs" error={error} isRootLevel={false} />
    );
  }
}
