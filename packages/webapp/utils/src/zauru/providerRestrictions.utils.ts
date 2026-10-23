import type { Session } from "@remix-run/node";
import {
  checkProviderRestrictionValue,
  handlePossibleAxiosErrors,
  matchReceptionTypeCode,
  normalizeProviderRestrictionValues,
  PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR,
  PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR,
} from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  getVariablesByName,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import type {
  AxiosUtilsResponse,
  ProviderRestrictionCheckResult,
  ProviderRestrictionRule,
  ReceptionType,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

const toRule = (
  row: WebAppRowGraphQL<ProviderRestrictionRule>,
): ProviderRestrictionRule => ({
  ...row.data,
  payee_id: Number(row.data?.payee_id),
  values: normalizeProviderRestrictionValues(row.data?.values),
});

export const mapProviderRestrictionRows = (
  rows?: WebAppRowGraphQL<ProviderRestrictionRule>[],
): ProviderRestrictionRule[] => (rows ?? []).map(toRule);

const getTableId = async (
  headers: any,
  session: Session,
  varName: string,
) => {
  const vars = await getVariablesByName(headers, session, [varName]);
  return vars[varName];
};

const getRules = (
  headers: any,
  session: Session,
  varName: string,
  label: string,
): Promise<AxiosUtilsResponse<WebAppRowGraphQL<ProviderRestrictionRule>[]>> =>
  handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session, varName);
    const response = await getWebAppTableRegisters<ProviderRestrictionRule>(
      session,
      tableId,
    );
    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar ${label}: ${response.userMsg}`,
      );
    }
    return response.data ?? [];
  });

const createRule = (
  headers: any,
  session: Session,
  varName: string,
  body: ProviderRestrictionRule,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
  handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session, varName);
    return createWebAppTableRegister<ProviderRestrictionRule>(
      headers,
      tableId,
      body,
    );
  });

const updateRule = (
  headers: any,
  session: Session,
  varName: string,
  id: number,
  body: Partial<ProviderRestrictionRule>,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
  handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session, varName);
    return updateWebAppTableRegister(headers, tableId, id, body);
  });

export const getProviderTypeRestrictions = (
  headers: any,
  session: Session,
) =>
  getRules(
    headers,
    session,
    PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR,
    "las restricciones de tipos por proveedor",
  );

export const createProviderTypeRestriction = (
  headers: any,
  session: Session,
  body: ProviderRestrictionRule,
) =>
  createRule(headers, session, PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR, body);

export const updateProviderTypeRestriction = (
  headers: any,
  session: Session,
  id: number,
  body: Partial<ProviderRestrictionRule>,
) =>
  updateRule(
    headers,
    session,
    PROVIDER_TYPE_RESTRICTIONS_TABLE_VAR,
    id,
    body,
  );

export const getProviderItemRestrictions = (
  headers: any,
  session: Session,
) =>
  getRules(
    headers,
    session,
    PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR,
    "las restricciones de verduras por proveedor",
  );

export const createProviderItemRestriction = (
  headers: any,
  session: Session,
  body: ProviderRestrictionRule,
) =>
  createRule(headers, session, PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR, body);

export const updateProviderItemRestriction = (
  headers: any,
  session: Session,
  id: number,
  body: Partial<ProviderRestrictionRule>,
) =>
  updateRule(
    headers,
    session,
    PROVIDER_ITEM_RESTRICTIONS_TABLE_VAR,
    id,
    body,
  );

const receptionTypeFromRow = (
  entry: WebAppRowGraphQL<ReceptionType> | ReceptionType,
): ReceptionType | undefined => {
  if (entry && typeof entry === "object" && "data" in entry) {
    return entry.data;
  }
  return entry as ReceptionType;
};

export const evaluateProviderReceptionRestrictions = (input: {
  payeeId: number;
  date: string;
  typeValue?: string;
  itemId?: number;
  typeRules?: WebAppRowGraphQL<ProviderRestrictionRule>[];
  itemRules?: WebAppRowGraphQL<ProviderRestrictionRule>[];
  receptionTypes?: Array<WebAppRowGraphQL<ReceptionType> | ReceptionType>;
  itemIds?: Array<string | number>;
  typeLabel?: string;
  itemLabel?: string;
}): ProviderRestrictionCheckResult => {
  const typeRules = mapProviderRestrictionRows(input.typeRules);
  const itemRules = mapProviderRestrictionRows(input.itemRules);
  const receptionTypes = (input.receptionTypes ?? [])
    .map(receptionTypeFromRow)
    .filter((type): type is ReceptionType => Boolean(type));
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
