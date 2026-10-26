import type { Session } from "@remix-run/node";
import {
  handlePossibleAxiosErrors,
  normalizeProviderRestrictionValues,
  normalizeRestrictionValue,
  PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR,
  PROVIDER_RECEPTION_MATRIX_TABLE_VAR,
} from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  getVariablesByName,
  getWebAppTableRegisters,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import type {
  AxiosUtilsResponse,
  ProviderReceptionBlockRule,
  ProviderReceptionException,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

export const FOUR_PINOS_NON_SELECTABLE_RECEPTION_ITEM_IDS = [
  782312, 782638,
] as const;

export const filter4PinosSelectableReceptionItems = <T extends { id: number }>(
  items: T[],
): T[] => {
  const excluded = new Set<number>(
    FOUR_PINOS_NON_SELECTABLE_RECEPTION_ITEM_IDS,
  );
  return items.filter((item) => !excluded.has(Number(item.id)));
};

const getTableId = async (
  headers: any,
  session: Session,
  varName: string,
): Promise<string> => {
  const variables = await getVariablesByName(headers, session, [varName]);
  return variables[varName];
};

const getRows = async <T>(input: {
  headers: any;
  session: Session;
  varName: string;
  label: string;
  filters?: { payeeId?: number; receptionTypeCode?: string };
}): Promise<AxiosUtilsResponse<WebAppRowGraphQL<T>[]>> =>
  handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(
      input.headers,
      input.session,
      input.varName,
    );
    const data: Record<string, string | number> = {};
    if (input.filters?.payeeId != null) {
      data.payee_id = Number(input.filters.payeeId);
    }
    if (input.filters?.receptionTypeCode != null) {
      data.reception_type_code = normalizeRestrictionValue(
        input.filters.receptionTypeCode,
      );
    }
    const response = await getWebAppTableRegisters<T>(input.session, tableId, {
      ...(Object.keys(data).length ? { data } : {}),
    });
    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar ${input.label}: ${response.userMsg}`,
      );
    }
    return response.data ?? [];
  });

const createRow = async <T>(input: {
  headers: any;
  session: Session;
  varName: string;
  body: T;
}): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
  handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(
      input.headers,
      input.session,
      input.varName,
    );
    return createWebAppTableRegister<T>(input.headers, tableId, input.body);
  });

const updateRow = async <T>(input: {
  headers: any;
  session: Session;
  varName: string;
  id: number;
  body: Partial<T>;
}): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> =>
  handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(
      input.headers,
      input.session,
      input.varName,
    );
    return updateWebAppTableRegister(
      input.headers,
      tableId,
      input.id,
      input.body,
    );
  });

export const getProviderReceptionBlockRules = (
  headers: any,
  session: Session,
  filters?: { payeeId?: number; receptionTypeCode?: string },
) =>
  getRows<ProviderReceptionBlockRule>({
    headers,
    session,
    varName: PROVIDER_RECEPTION_MATRIX_TABLE_VAR,
    label: "la matriz de restricciones de recepción",
    filters,
  });

export const createProviderReceptionBlockRule = (
  headers: any,
  session: Session,
  body: ProviderReceptionBlockRule,
) =>
  createRow({
    headers,
    session,
    varName: PROVIDER_RECEPTION_MATRIX_TABLE_VAR,
    body: {
      ...body,
      blocked_item_ids: normalizeProviderRestrictionValues(
        body.blocked_item_ids,
      ),
    },
  });

export const updateProviderReceptionBlockRule = (
  headers: any,
  session: Session,
  id: number,
  body: Partial<ProviderReceptionBlockRule>,
) =>
  updateRow<ProviderReceptionBlockRule>({
    headers,
    session,
    varName: PROVIDER_RECEPTION_MATRIX_TABLE_VAR,
    id,
    body,
  });

export const getProviderReceptionExceptions = (
  headers: any,
  session: Session,
  filters?: { payeeId?: number; receptionTypeCode?: string },
) =>
  getRows<ProviderReceptionException>({
    headers,
    session,
    varName: PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR,
    label: "las excepciones temporales de recepción",
    filters,
  });

export const createProviderReceptionException = (
  headers: any,
  session: Session,
  body: ProviderReceptionException,
) =>
  createRow({
    headers,
    session,
    varName: PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR,
    body: {
      ...body,
      item_ids: normalizeProviderRestrictionValues(body.item_ids),
    },
  });

export const updateProviderReceptionException = (
  headers: any,
  session: Session,
  id: number,
  body: Partial<ProviderReceptionException>,
) =>
  updateRow<ProviderReceptionException>({
    headers,
    session,
    varName: PROVIDER_RECEPTION_EXCEPTIONS_TABLE_VAR,
    id,
    body,
  });
