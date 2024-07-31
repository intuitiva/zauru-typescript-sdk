import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import httpGraphQLAPI from "./httpGraphQL.js";
import { getPaymentMethodsStringQuery } from "@zauru-sdk/graphql";
/**
 * getPaymentTerms
 */
/**
 * getPaymentTerms
 */
export async function getPaymentMethods(session, config = {
    onlyActives: true,
}) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        console.log(getPaymentMethodsStringQuery({
            onlyActives: config.onlyActives,
        }));
        const response = await httpGraphQLAPI.post("", {
            query: getPaymentMethodsStringQuery({
                onlyActives: config.onlyActives,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.payment_methods;
        return registers;
    });
}
