import { checkProviderRestrictionValue, handlePossibleAxiosErrors, matchReceptionTypeCode, normalizeProviderRestrictionValues, PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR, PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR, } from "@zauru-sdk/common";
import { createWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
const toRule = (row) => ({
    ...row.data,
    payee_id: Number(row.data?.payee_id),
    values: normalizeProviderRestrictionValues(row.data?.values),
});
export const mapProviderRestrictionRows = (rows) => (rows ?? []).map(toRule);
const getTableId = async (headers, session, varName) => {
    const vars = await getVariablesByName(headers, session, [varName]);
    return vars[varName];
};
const getRules = (headers, session, varName, label) => handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session, varName);
    const response = await getWebAppTableRegisters(session, tableId);
    if (response.error) {
        throw new Error(`Ocurrió un error al consultar ${label}: ${response.userMsg}`);
    }
    return response.data ?? [];
});
const createRule = (headers, session, varName, body) => handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session, varName);
    return createWebAppTableRegister(headers, tableId, body);
});
const updateRule = (headers, session, varName, id, body) => handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session, varName);
    return updateWebAppTableRegister(headers, tableId, id, body);
});
export const getProviderTypeRestrictions = (headers, session) => getRules(headers, session, PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR, "las restricciones de tipos por proveedor");
export const createProviderTypeRestriction = (headers, session, body) => createRule(headers, session, PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR, body);
export const updateProviderTypeRestriction = (headers, session, id, body) => updateRule(headers, session, PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR, id, body);
export const getProviderItemRestrictions = (headers, session) => getRules(headers, session, PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR, "las restricciones de verduras por proveedor");
export const createProviderItemRestriction = (headers, session, body) => createRule(headers, session, PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR, body);
export const updateProviderItemRestriction = (headers, session, id, body) => updateRule(headers, session, PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR, id, body);
const receptionTypeFromRow = (entry) => {
    if (entry && typeof entry === "object" && "data" in entry) {
        return entry.data;
    }
    return entry;
};
export const evaluateProviderReceptionRestrictions = (input) => {
    const typeRules = mapProviderRestrictionRows(input.typeRules);
    const itemRules = mapProviderRestrictionRows(input.itemRules);
    const receptionTypes = (input.receptionTypes ?? [])
        .map(receptionTypeFromRow)
        .filter((type) => Boolean(type));
    const typeUniverse = receptionTypes
        .map((type) => String(type.Codigo ?? "").trim())
        .filter(Boolean);
    if (input.typeValue) {
        const code = matchReceptionTypeCode(input.typeValue, receptionTypes);
        const typeCheck = checkProviderRestrictionValue({
            payeeId: input.payeeId,
            date: input.date,
            value: code,
            valueLabel: input.typeLabel || input.typeValue,
            label: "Tipo",
            rules: typeRules,
            universe: typeUniverse,
        });
        if (!typeCheck.allowed) {
            return typeCheck;
        }
    }
    if (input.itemId != null && Number(input.itemId) > 0) {
        const itemCheck = checkProviderRestrictionValue({
            payeeId: input.payeeId,
            date: input.date,
            value: Number(input.itemId),
            valueLabel: input.itemLabel || String(input.itemId),
            label: "Verdura",
            rules: itemRules,
            universe: input.itemIds ?? [],
        });
        if (!itemCheck.allowed) {
            return itemCheck;
        }
    }
    return { allowed: true };
};
