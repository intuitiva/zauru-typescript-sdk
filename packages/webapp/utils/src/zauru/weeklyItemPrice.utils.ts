import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { getPayee, getPayees } from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  BitacoraCostosItems,
  CalculateItemPriceFromWeeklyMatrixInput,
  CalculateItemPriceFromWeeklyMatrixResult,
  CostoSemanal,
  CostoSemanalSpecialItem,
  SpecialItem,
  WebAppRowGraphQL,
  WeeklyCostMatrix,
  WeeklyCostPeriod,
} from "@zauru-sdk/types";
import { getCostosBitacora } from "./costos-items.utils.js";
import {
  applyPriceAdjustmentRules,
  filterActivePriceAdjustmentRules,
  formatPriceAdjustmentDescription,
  getPriceAdjustmentRules,
  normalizeComparableValue,
} from "./priceAdjustmentRules.utils.js";
import { getSpecialItems } from "./specialItem.utils.js";

export const MASSIVE_VEGETABLE_COST_ACCION = "Costos masivamente";
const FALLBACK_UNIT_COST = 1;

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const isSpecialItemRow = (
  item: SpecialItem | WebAppRowGraphQL<SpecialItem>,
): item is WebAppRowGraphQL<SpecialItem> =>
  typeof (item as WebAppRowGraphQL<SpecialItem>).id === "number" &&
  Boolean((item as WebAppRowGraphQL<SpecialItem>).data);

const isWeekday = (value: number): value is Weekday =>
  value === 0 ||
  value === 1 ||
  value === 2 ||
  value === 3 ||
  value === 4 ||
  value === 5 ||
  value === 6;

export const parseWeeklyCostDate = (value: string): Date | null => {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) {
    return null;
  }

  const ymd = /^(\d{4})[-/](\d{2})[-/](\d{2})/.exec(trimmed);
  if (ymd) {
    return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  }

  const dmy = /^(\d{2})[-/](\d{2})[-/](\d{4})/.exec(trimmed);
  if (dmy) {
    return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatDateYYYYSlashMMSlashDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const getMondayOfWeeklyCostDate = (date: string): string | null => {
  const parsed = parseWeeklyCostDate(date);
  if (!parsed) {
    return null;
  }

  const weekday = parsed.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  const monday = new Date(parsed);
  monday.setDate(parsed.getDate() - daysFromMonday);
  return formatDateYYYYSlashMMSlashDD(monday);
};

export const getWeeklyCostPeriod = (date: string): WeeklyCostPeriod => {
  const parsed = parseWeeklyCostDate(date);
  const weekday = parsed?.getDay();
  if (!parsed || weekday === undefined || !isWeekday(weekday)) {
    return "lunMar";
  }

  switch (weekday) {
    case 1:
    case 2:
      return "lunMar";
    case 3:
    case 4:
      return "mieJue";
    case 5:
    case 6:
    case 0:
      return "vieSabDom";
    default: {
      const _exhaustive: never = weekday;
      return _exhaustive;
    }
  }
};

export const getWeeklyCostPeriodPrice = (
  costo: Pick<CostoSemanal, WeeklyCostPeriod> | undefined,
  period: WeeklyCostPeriod,
): number | null => {
  if (!costo) {
    return null;
  }

  const value = Number(costo[period]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return value;
};

export const getPriceByDate = (
  date: string,
  _fechas: WeeklyCostMatrix["fechas"] | undefined,
  costo?: CostoSemanal | CostoSemanalSpecialItem,
): number => getWeeklyCostPeriodPrice(costo, getWeeklyCostPeriod(date)) ?? FALLBACK_UNIT_COST;

export const filterActiveSpecialItems = (
  specialItems?: Array<SpecialItem | WebAppRowGraphQL<SpecialItem>>,
): WebAppRowGraphQL<SpecialItem>[] =>
  (specialItems ?? [])
    .filter(isSpecialItemRow)
    .filter((row) => !row.data?.fechaEliminacion)
    .sort((a, b) => a.id - b.id);

export const matchSpecialItemForWeeklyPrice = (
  specialItems: Array<SpecialItem | WebAppRowGraphQL<SpecialItem>> | undefined,
  params: { itemId: number; region?: string; tipo?: string },
): WebAppRowGraphQL<SpecialItem> | undefined =>
  filterActiveSpecialItems(specialItems).find(
    (specialItem) =>
      specialItem.data.item === params.itemId &&
      specialItem.data.region === params.region &&
      normalizeComparableValue(specialItem.data.tipo) ===
        normalizeComparableValue(params.tipo),
  );

export const pickLatestMassiveCostBitacora = (
  rows: WebAppRowGraphQL<BitacoraCostosItems>[] | undefined,
  date?: string,
): WebAppRowGraphQL<BitacoraCostosItems> | undefined => {
  const masivas = (rows ?? [])
    .filter((row) => row.data?.accion === MASSIVE_VEGETABLE_COST_ACCION)
    .sort((a, b) => b.id - a.id);

  const monday = date ? getMondayOfWeeklyCostDate(date) : null;
  if (monday) {
    const matchingWeek = masivas.find(
      (row) => row.data?.fechas?.lunes === monday,
    );
    if (matchingWeek) {
      return matchingWeek;
    }
  }

  return masivas[0];
};

const sourceLabel = (
  source: CalculateItemPriceFromWeeklyMatrixResult["source"],
): string => {
  if (source === "especial") {
    return "especial";
  }
  if (source === "fallback") {
    return "sin matriz";
  }
  return "base";
};

export const calculateItemPriceFromWeeklyMatrix = (
  input: CalculateItemPriceFromWeeklyMatrixInput,
): CalculateItemPriceFromWeeklyMatrixResult => {
  const period = getWeeklyCostPeriod(input.date);
  const matrix = input.matrix;
  const matchedSpecial = matchSpecialItemForWeeklyPrice(input.specialItems, {
    itemId: input.itemId,
    region: input.region,
    tipo: input.tipo,
  });

  let source: CalculateItemPriceFromWeeklyMatrixResult["source"] = "fallback";
  let basePrice = FALLBACK_UNIT_COST;
  let specialItemId: number | undefined;

  if (matchedSpecial) {
    const specialPrice = getWeeklyCostPeriodPrice(
      matrix?.costosEspeciales?.find(
        (costo) => costo.specialItemId === matchedSpecial.id,
      ),
      period,
    );
    if (specialPrice != null) {
      source = "especial";
      basePrice = specialPrice;
      specialItemId = matchedSpecial.id;
    }
  }

  if (source === "fallback") {
    const generalPrice = getWeeklyCostPeriodPrice(
      matrix?.costos?.find((costo) => costo.item === input.itemId),
      period,
    );
    if (generalPrice != null) {
      source = "general";
      basePrice = generalPrice;
    }
  }

  const adjusted = applyPriceAdjustmentRules(basePrice, input.rules ?? [], {
    itemId: input.itemId,
    tipo: input.tipo,
    providerCategoryId: input.providerCategoryId,
  });

  return {
    ...adjusted,
    description: formatPriceAdjustmentDescription(adjusted, sourceLabel(source)),
    source,
    period,
    specialItemId,
  };
};

export const loadLatestWeeklyCostMatrix = (
  headers: any,
  session: Session,
  date?: string,
): Promise<AxiosUtilsResponse<WeeklyCostMatrix | null>> => {
  return handlePossibleAxiosErrors(async () => {
    const bitacoraResponse = await getCostosBitacora(headers, session);
    if (bitacoraResponse.error) {
      throw new Error(
        `Error al intentar obtener la bitácora de costos de verduras: ${
          bitacoraResponse.userMsg ?? ""
        }`,
      );
    }

    const bitacoraRow = pickLatestMassiveCostBitacora(
      bitacoraResponse.data ?? [],
      date,
    );
    if (!bitacoraRow?.data) {
      return null;
    }

    return {
      costos: bitacoraRow.data.costos ?? [],
      costosEspeciales: bitacoraRow.data.costosEspeciales ?? [],
      fechas: bitacoraRow.data.fechas,
    };
  });
};

export const resolveItemPriceFromLatestWeeklyMatrix = (
  headers: any,
  session: Session,
  params: {
    itemId: number;
    date: string;
    region?: string;
    tipo?: string;
    payeeId?: number;
  },
): Promise<AxiosUtilsResponse<CalculateItemPriceFromWeeklyMatrixResult>> => {
  return handlePossibleAxiosErrors(async () => {
    const [matrixResponse, specialItemsResponse, rulesResponse] =
      await Promise.all([
        loadLatestWeeklyCostMatrix(headers, session, params.date),
        getSpecialItems(headers, session),
        getPriceAdjustmentRules(headers, session),
      ]);

    if (matrixResponse.error) {
      throw new Error(
        `Error al cargar la última matriz de costos: ${
          matrixResponse.userMsg ?? ""
        }`,
      );
    }

    if (specialItemsResponse.error) {
      throw new Error(
        `Error al intentar obtener los precios especiales de verduras: ${
          specialItemsResponse.userMsg ?? ""
        }`,
      );
    }

    if (rulesResponse.error) {
      throw new Error(
        `Error al obtener las reglas de ajuste de precio: ${
          rulesResponse.userMsg ?? ""
        }`,
      );
    }

    let providerCategoryId: number | undefined;
    if (params.payeeId != null) {
      const payeeResponse = await getPayee(session, params.payeeId);
      if (!payeeResponse.error && payeeResponse.data) {
        providerCategoryId = payeeResponse.data.payee_category_id;
      } else {
        const payeesResponse = await getPayees(session);
        if (payeesResponse.error || !payeesResponse.data) {
          throw new Error(
            `Error al obtener el proveedor para aplicar las reglas de ajuste: ${
              payeeResponse.userMsg ?? payeesResponse.userMsg ?? ""
            }`,
          );
        }
        providerCategoryId = payeesResponse.data.find(
          (payee) => payee.id === params.payeeId,
        )?.payee_category_id;
      }
    }

    return calculateItemPriceFromWeeklyMatrix({
      itemId: params.itemId,
      date: params.date,
      region: params.region,
      tipo: params.tipo,
      providerCategoryId,
      matrix: matrixResponse.data,
      specialItems: specialItemsResponse.data ?? [],
      rules: filterActivePriceAdjustmentRules(rulesResponse.data),
    });
  });
};
