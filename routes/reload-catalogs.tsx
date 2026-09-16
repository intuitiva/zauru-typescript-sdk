import { createReloadCatalogsLoader } from "@zauru-sdk/utils";
import {
  ZauruReloadCatalogsPage,
  zauruRouteErrorBoundary,
} from "@zauru-sdk/components";
import { useGetPayees } from "@zauru-sdk/hooks";

export const loader = createReloadCatalogsLoader();
export const ErrorBoundary = zauruRouteErrorBoundary("/reload-catalogs");

export default function ReloadCatalogs() {
  const { loading: payeesLoading } = useGetPayees({ online: true });
  return (
    <ZauruReloadCatalogsPage
      items={[{ name: "Proveedores", loading: payeesLoading }]}
    />
  );
}
