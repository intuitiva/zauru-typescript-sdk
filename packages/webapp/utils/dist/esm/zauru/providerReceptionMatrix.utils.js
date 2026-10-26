import { handlePossibleAxiosErrors, normalizeProviderRestrictionValues, normalizeRestrictionValue, PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR, PROVIDER_RECEPTION_MATRIX_TABLE_VAR, } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
export const FOUR_PINOS_NON_SELECTABLE_RECEPTION_ITEM_IDS = [
    782312, 782638,
];
export const filter4PinosSelectableReceptionItems = (items) => {
    const excluded = new Set(FOUR_PINOS_NON_SELECTABLE_RECEPTION_ITEM_IDS);
    return items.filter((item) => !excluded.has(Number(item.id)));
};
const getTableId = async (headers, session, varName) => {
    const variables = await getVariablesByName(headers, session, [varName]);
    return variables[varName];
};
const getRows = async (input) => handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(input.headers, input.session, input.varName);
    const data = {};
    if (input.filters?.payeeId != null) {
        data.payee_id = Number(input.filters.payeeId);
    }
    if (input.filters?.receptionTypeCode != null) {
        data.reception_type_code = normalizeRestrictionValue(input.filters.receptionTypeCode);
    }
    const response = await getWebAppTableRegisters(input.session, tableId, {
        ...(Object.keys(data).length ? { data } : {}),
    });
    if (response.error) {
        throw new Error(`Ocurrió un error al consultar ${input.label}: ${response.userMsg}`);
    }
    return response.data ?? [];
});
const createRow = async (input) => handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(input.headers, input.session, input.varName);
    return createWebAppTableRegister(input.headers, tableId, input.body);
});
const updateRow = async (input) => handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(input.headers, input.session, input.varName);
    return updateWebAppTableRegister(input.headers, tableId, input.id, input.body);
});
export const getProviderReceptionBlockRules = (headers, session, filters) => getRows({
    headers,
    session,
    varName: PROVIDER_RECEPTION_MATRIX_TABLE_VAR,
    label: "la matriz de restricciones de recepción",
    filters,
});
export const createProviderReceptionBlockRule = (headers, session, body) => createRow({
    headers,
    session,
    varName: PROVIDER_RECEPTION_MATRIX_TABLE_VAR,
    body: {
        ...body,
        blocked_item_ids: normalizeProviderRestrictionValues(body.blocked_item_ids),
    },
});
export const updateProviderReceptionBlockRule = (headers, session, id, body) => updateRow({
    headers,
    session,
    varName: PROVIDER_RECEPTION_MATRIX_TABLE_VAR,
    id,
    body,
});
export const getProviderReceptionExceptions = (headers, session, filters) => getRows({
    headers,
    session,
    varName: PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR,
    label: "las excepciones temporales de recepción",
    filters,
});
export const createProviderReceptionException = (headers, session, body) => createRow({
    headers,
    session,
    varName: PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR,
    body: {
        ...body,
        item_ids: normalizeProviderRestrictionValues(body.item_ids),
    },
});
export const updateProviderReceptionException = (headers, session, id, body) => updateRow({
    headers,
    session,
    varName: PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR,
    id,
    body,
});
