import { ProfileResponse, SelectFieldOption } from "@zauru-sdk/types";

/**
 *
 * @param profileInfoObject
 * @returns
 */
export function getInitialProfileInfo(profileInfoObject?: ProfileResponse) {
  if (!Object.keys(profileInfoObject ?? {}).length || !profileInfoObject) {
    return {
      profileLabelInfo: [
        { label: "Nombre", value: "Cargando..." },
        { label: "E Mail", value: "Cargando..." },
      ] as SelectFieldOption[],
      membershipsInfo: [
        {
          entity: "Cargando...",
          contractExpiration: "Cargando...",
          nextPay: "Cargando...",
          entityId: 0,
        },
      ],
    };
  }

  const profile = profileInfoObject.profile;
  const profileLabelInfo = [
    { label: "Nombre", value: profile.name },
    { label: "E Mail", value: profile.email },
  ] as SelectFieldOption[];

  const membershipsInfo = profileInfoObject.memberships.map(
    (membership: any) => {
      return {
        entity: membership.entity.name,
        contractExpiration: membership.eternal ? "NUNCA" : "EXPIRA",
        nextPay: new Date(Date.parse(membership.expires)).toLocaleDateString(),
        entityId: membership.entity_id,
      };
    }
  );

  return { profileLabelInfo, membershipsInfo };
}
