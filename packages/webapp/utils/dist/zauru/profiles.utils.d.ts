import { ProfileResponse, SelectFieldOption } from "@zauru-sdk/types";
/**
 *
 * @param profileInfoObject
 * @returns
 */
export declare function getInitialProfileInfo(profileInfoObject?: ProfileResponse): {
    profileLabelInfo: SelectFieldOption[];
    membershipsInfo: {
        entity: any;
        contractExpiration: string;
        nextPay: string;
        entityId: any;
    }[];
};
