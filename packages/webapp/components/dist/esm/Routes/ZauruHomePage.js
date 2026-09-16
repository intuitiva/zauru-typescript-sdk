import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
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
export function ZauruHomePage({ title, includeAgency = true, extra, }) {
    try {
        const [isClient, setIsClient] = useState(false);
        const { data: userProfile } = useGetUserProfile();
        const { data: agencyProfile, loading: loadingAgencyProfile } = useGetAgencyProfile();
        useEffect(() => {
            setIsClient(true);
        }, []);
        const { profileLabelInfo, membershipsInfo } = getInitialProfileInfo(userProfile);
        const conditionalRowStyles = [
            {
                when: (row) => row.odd,
                style: {
                    backgroundColor: "white",
                    "&:hover": {
                        cursor: "pointer",
                    },
                },
            },
            {
                when: (row) => row.entityId === userProfile?.profile?.selected_entity_id,
                style: () => ({ backgroundColor: "lightgreen" }),
            },
        ];
        const columns = [
            {
                name: "Entidad",
                selector: (row) => row.entity,
            },
            {
                name: "Contrato Expira",
                selector: (row) => row.contractExpiration,
                width: "10rem",
            },
            {
                name: "Pagado hasta",
                selector: (row) => row.nextPay,
                width: "10rem",
            },
        ];
        if (!isClient) {
            return _jsx(LoadingWindow, { description: "Cargando home..." });
        }
        const pageTitle = includeAgency
            ? loadingAgencyProfile || !agencyProfile
                ? "Cargando..."
                : `${title} (${agencyProfile?.name ?? "Usuario sin agencia asignada"})`
            : title;
        const profileAndMemberships = (_jsxs(_Fragment, { children: [_jsx(SubContainer, { title: "Perfil", children: _jsx(LabelArray, { info: profileLabelInfo }) }), _jsx(SubContainer, { title: "Suscripciones", children: _jsx(ZauruTable, { columns: columns, conditionalRowStyles: conditionalRowStyles, data: membershipsInfo }) })] }));
        return (_jsx(MainContainer, { children: extra ? (_jsxs(DoubleContainer, { title: pageTitle, children: [profileAndMemberships, extra] })) : (_jsx(Container, { title: pageTitle, children: profileAndMemberships })) }));
    }
    catch (error) {
        return (_jsx(ErrorLayout, { from: "/home/index.tsx", error: error, isRootLevel: false }));
    }
}
