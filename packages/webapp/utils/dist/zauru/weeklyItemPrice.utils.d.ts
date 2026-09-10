import type { Session } from "@remix-run/node";
import { AxiosUtilsResponse, BitacoraCostosItems, CalculateItemPriceFromWeeklyMatrixInput, CalculateItemPriceFromWeeklyMatrixResult, CostoSemanal, CostoSemanalSpecialItem, SpecialItem, WebAppRowGraphQL, WeeklyCostMatrix, WeeklyCostPeriod } from "@zauru-sdk/types";
export declare const MASSIVE_VEGETABLE_COST_ACCION = "Costos masivamente";
export declare const parseWeeklyCostDate: (value: string) => Date | null;
export declare const getMondayOfWeeklyCostDate: (date: string) => string | null;
export declare const getWeeklyCostPeriod: (date: string) => WeeklyCostPeriod;
export declare const getWeeklyCostPeriodPrice: (costo: Pick<CostoSemanal, WeeklyCostPeriod> | undefined, period: WeeklyCostPeriod) => number | null;
export declare const getPriceByDate: (date: string, _fechas: WeeklyCostMatrix["fechas"] | undefined, costo?: CostoSemanal | CostoSemanalSpecialItem) => number;
export declare const filterActiveSpecialItems: (specialItems?: Array<SpecialItem | WebAppRowGraphQL<SpecialItem>>) => WebAppRowGraphQL<SpecialItem>[];
export declare const matchSpecialItemForWeeklyPrice: (specialItems: Array<SpecialItem | WebAppRowGraphQL<SpecialItem>> | undefined, params: {
    itemId: number;
    region?: string;
    tipo?: string;
}) => WebAppRowGraphQL<SpecialItem> | undefined;
export declare const pickLatestMassiveCostBitacora: (rows: WebAppRowGraphQL<BitacoraCostosItems>[] | undefined, date?: string) => WebAppRowGraphQL<BitacoraCostosItems> | undefined;
export declare const calculateItemPriceFromWeeklyMatrix: (input: CalculateItemPriceFromWeeklyMatrixInput) => CalculateItemPriceFromWeeklyMatrixResult;
export declare const loadLatestWeeklyCostMatrix: (headers: any, session: Session, date?: string) => Promise<AxiosUtilsResponse<WeeklyCostMatrix | null>>;
export declare const resolveItemPriceFromLatestWeeklyMatrix: (headers: any, session: Session, params: {
    itemId: number;
    date: string;
    region?: string;
    tipo?: string;
    payeeId?: number;
}) => Promise<AxiosUtilsResponse<CalculateItemPriceFromWeeklyMatrixResult>>;
