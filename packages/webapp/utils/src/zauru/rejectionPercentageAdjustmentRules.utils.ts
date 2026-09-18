import type { Session } from "@remix-run/node";
import {
  filterActiveRejectionPercentageAdjustmentRules,
  handlePossibleAxiosErrors,
  REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR,
} from "@zauru-sdk/common";
import {
  createWebAppTableRegister,
  getVariables,
  getVariablesByName,
  getWebAppTableRegisters,
  getWebAppTableRegistersRest,
  updateWebAppTableRegister,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  RejectionPercentageAdjustmentRule,
  WebAppRowGraphQL,
  WebAppTableUpdateResponse,
} from "@zauru-sdk/types";

export {
  applyRejectionPercentageAdjustmentRules,
  filterActiveRejectionPercentageAdjustmentRules,
  formatAutomaticRejectionRuleHistoryDescription,
  formatRejectionPercentageAdjustmentDescription,
  getNewlyAppliedRejectionRuleSteps,
  isAutomaticRejectionRuleHistoryType,
  rejectionPercentageAdjustmentRuleMatches,
  resolveRejectionPercentageBase,
  resolveRejectionPercentageOrigin,
  REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR,
  REJECTION_PERCENTAGE_RULE_HISTORY_TYPE,
} from "@zauru-sdk/common";

const getTableId = async (headers: any, session: Session) => {
  const vars = await getVariablesByName(headers, session, [
    REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR,
  ]);
  return vars[REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR];
};

export const getRejectionPercentageAdjustmentRules = (
  headers: any,
  session: Session,
): Promise<
  AxiosUtilsResponse<WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[]>
> => {
  return handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session);
    const response =
      await getWebAppTableRegisters<RejectionPercentageAdjustmentRule>(
        session,
        tableId,
      );

    if (response.error) {
      throw new Error(
        `Ocurrió un error al consultar las reglas de ajuste de porcentaje de rechazo: ${response.userMsg}`,
      );
    }

    return response.data ?? [];
  });
};

/**
 * Same listing without a Remix session: resolves the table id over REST, for
 * background flows that only carry the Zauru headers.
 */
export const getRejectionPercentageAdjustmentRulesByHeaders = (
  headers: any,
): Promise<
  AxiosUtilsResponse<WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[]>
> => {
  return handlePossibleAxiosErrors(async () => {
    const varsResponse = await getVariables(headers);
    const tableId = varsResponse.data?.find(
      (variable) =>
        variable.name === REJECTION_PERCENTAGE_ADJUSTMENT_RULES_TABLE_VAR,
    )?.value;

    if (varsResponse.error || !tableId) {
      return [];
    }

    const rowsResponse =
      await getWebAppTableRegistersRest<RejectionPercentageAdjustmentRule>(
        headers,
        tableId,
      );

    if (rowsResponse.error) {
      throw new Error(
        `Ocurrió un error al consultar las reglas de ajuste de porcentaje de rechazo: ${rowsResponse.userMsg}`,
      );
    }

    return rowsResponse.data ?? [];
  });
};

export const getActiveRejectionPercentageAdjustmentRules = async (
  headers: any,
  session?: Session,
): Promise<WebAppRowGraphQL<RejectionPercentageAdjustmentRule>[]> => {
  try {
    if (session) {
      const response = await getRejectionPercentageAdjustmentRules(
        headers,
        session,
      );
      if (response.error) {
        return [];
      }
      return filterActiveRejectionPercentageAdjustmentRules(response.data);
    }

    const response =
      await getRejectionPercentageAdjustmentRulesByHeaders(headers);
    if (response.error) {
      return [];
    }
    return filterActiveRejectionPercentageAdjustmentRules(response.data);
  } catch {
    return [];
  }
};

export const createRejectionPercentageAdjustmentRule = (
  headers: any,
  session: Session,
  body: RejectionPercentageAdjustmentRule,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session);
    return createWebAppTableRegister<RejectionPercentageAdjustmentRule>(
      headers,
      tableId,
      body,
    );
  });
};

export const updateRejectionPercentageAdjustmentRule = (
  headers: any,
  session: Session,
  id: string,
  body: Partial<RejectionPercentageAdjustmentRule>,
): Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>> => {
  return handlePossibleAxiosErrors(async () => {
    const tableId = await getTableId(headers, session);
    return updateWebAppTableRegister(headers, tableId, Number(id), body);
  });
};
