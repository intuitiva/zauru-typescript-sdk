import { useEffect, useState, type ReactNode } from "react";
import { useGetAgencyProfile, useGetUserProfile } from "@zauru-sdk/hooks";
import { getInitialProfileInfo } from "@zauru-sdk/utils";
import { LabelArray } from "../Titles/LabelArray.js";
import { ZauruTable } from "../Table/ZauruTable.js";
import { Container } from "../Containers/Container.js";
import { DoubleContainer } from "../Containers/DoubleContainer.js";
import { MainContainer } from "../Containers/MainContainer.js";
import { SubContainer } from "../Containers/SubContainer.js";
import { ErrorLayout } from "../Layouts/errorLayout/index.js";
import { LoadingWindow } from "../Skeletons/LoadingWindow.js";

export type ZauruHomePageProps = {
  title: string;
  includeAgency?: boolean;
  extra?: ReactNode;
};

export function ZauruHomePage({
  title,
  includeAgency = true,
  extra,
}: ZauruHomePageProps) {
  try {
    const [isClient, setIsClient] = useState(false);
    const { data: userProfile } = useGetUserProfile();
    const { data: agencyProfile, loading: loadingAgencyProfile } =
      useGetAgencyProfile();

    useEffect(() => {
      setIsClient(true);
    }, []);

    const { profileLabelInfo, membershipsInfo } =
      getInitialProfileInfo(userProfile);

    const conditionalRowStyles = [
      {
        when: (row: { odd: any; entityId: any }) => row.odd,
        style: {
          backgroundColor: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row: { entityId: any }) =>
          row.entityId === userProfile?.profile?.selected_entity_id,
        style: () => ({ backgroundColor: "lightgreen" }),
      },
    ];

    const columns: any = [
      {
        name: "Entidad",
        selector: (row: any) => row.entity,
      },
      {
        name: "Contrato Expira",
        selector: (row: any) => row.contractExpiration,
        width: "10rem",
      },
      {
        name: "Pagado hasta",
        selector: (row: any) => row.nextPay,
        width: "10rem",
      },
    ];

    if (!isClient) {
      return <LoadingWindow description="Cargando home..." />;
    }

    const pageTitle = includeAgency
      ? loadingAgencyProfile || !agencyProfile
        ? "Cargando..."
        : `${title} (${agencyProfile?.name ?? "Usuario sin agencia asignada"})`
      : title;

    const profileAndMemberships = (
      <>
        <SubContainer title="Perfil">
          <LabelArray info={profileLabelInfo} />
        </SubContainer>
        <SubContainer title="Suscripciones">
          <ZauruTable
            columns={columns}
            conditionalRowStyles={conditionalRowStyles}
            data={membershipsInfo}
          />
        </SubContainer>
      </>
    );

    return (
      <MainContainer>
        {extra ? (
          <DoubleContainer title={pageTitle}>
            {profileAndMemberships}
            {extra}
          </DoubleContainer>
        ) : (
          <Container title={pageTitle}>{profileAndMemberships}</Container>
        )}
      </MainContainer>
    );
  } catch (error: any) {
    return (
      <ErrorLayout from="/home/index.tsx" error={error} isRootLevel={false} />
    );
  }
}
