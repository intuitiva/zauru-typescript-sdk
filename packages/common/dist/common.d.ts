import "moment-timezone";
import type { PayeeGraphQL, AxiosUtilsResponse, BasketSchema, SelectFieldOption } from "@zauru-sdk/types";
export declare const DESTINOS_MUESTRA_OPTIONS: SelectFieldOption[];
/**
 * Obtener el objeto de canastas en base al string de canastas
 * @param basketsString
 * @returns
 */
export declare const getBasketsSchema: (basketsString: string) => BasketSchema[];
export declare function generateClientUUID(): string;
/**
 * extractValueBetweenTags
 * @param input
 * @param tagName
 * @returns
 */
export declare function extractValueBetweenTags(input: string, tagName: string): string;
/**
 * isJsonArray
 * @param value
 * @returns
 */
export declare function isJsonArray(value: string): boolean;
/**
 *
 * @param date Recibe el date en formato UTC
 */
export declare const getFechaJuliana: (date: string) => string;
/**
 * Convierte una fecha de tipo 25 de jul de 2022 a Date
 * @param date
 * @returns
 */
export declare const getNewDateByFormat: (date: string) => Date;
/**
 * Convierte una fecha de tipo 25 de jul de 2022 a YYYY-MM-DD
 * @param date
 * @returns
 */
export declare const getZauruDateByText: (date: string) => string;
/**
 * Convierte una fecha de tipo Date a YYYY-MM-DD
 * @param date
 * @returns
 */
export declare const getStringDate: (date: Date) => string;
export declare function truncateText(text?: string, maxLength?: number): string;
export declare const getTodayDaysDifference: (date: string) => number;
export declare const getTodayMinutesDifference: (date: string) => number;
/**
 * Convierte una fecha de tipo Date a DD-MM-YYY HH:mm:ss
 * @param date
 * @returns
 */
export declare const getStringFullDate: (date: Date) => string;
/**
 * Convierte una fecha de tipo DD/MM/YYYY a YYYY/MM/DD
 * @param dateStr
 * @returns
 */
export declare const localDateToUSDate: (dateStr: string) => string;
export declare const stringDateToParsedUTCDate: (date: string) => Date;
/**
 * zauruDateToLongString
 * @param date
 * @returns
 */
export declare function zauruDateToLongString(date: string, hours?: boolean): string;
/**
 * todayLongString
 * @param date
 * @returns
 */
export declare function todayLongString(hours?: boolean): string;
export declare function isToday(dateStr: string): boolean;
export declare const getDatePickerCurrentDate: () => string;
export declare const getTimePickerCurrentTime: () => string;
export declare const getDateAfterDays: (daysAfterToday: number) => string;
export declare const getPayeeFormated: (payee: PayeeGraphQL) => string;
export declare const getPayeeInfoIdOptions: (payees: PayeeGraphQL[]) => (SelectFieldOption & {
    id: number;
})[];
export declare const getPayeeInfoOptions: (payees: PayeeGraphQL[]) => (SelectFieldOption & {
    id: number;
})[];
export declare const parsedBaculoFormValue: (value: any, config?: {
    trueValue: string;
    falseValue: string;
}) => string | undefined;
export declare function extractIdFromForm(s: string): number | null;
/**
 * Formatea una fecha de tipo YYYY-MM-DD a 2023-08-07T20:56:00.540245
 * @param dateString
 * @returns
 */
export declare function formatDateToUTC(dateString: string): string;
export declare const formatDateToDatePicker: (date: Date) => string;
export declare const formatTimeToTimePicker: (timeString: string) => Date;
export declare const toFixedIfNeeded: (value: number) => string;
export declare const isNumeric: (value: any) => boolean;
export declare function incrementString(str: string): string;
export declare function getParsedIdFromString(inputString: string): number;
export declare const arrayToObject: (arr?: Array<any>, options?: {
    withOutId?: boolean;
}) => {
    [key: string]: any;
};
export declare function convertToFormData(obj: any): FormData;
export declare const ZAURU_REGEX: {
    porcentaje: RegExp;
};
/**
 * Para hacer sumas en los reduce de arreglos enteros
 * @param accumulator
 * @param a
 * @returns
 */
export declare function reduceAdd(accumulator: number, a: number): number;
/**
 * Truncar decimales, ejemplo: truncateDecimals(43.434340934, 2) => 43.43
 * @param number
 * @param digits
 * @returns
 */
export declare const truncateDecimals: (number: number, digits: number) => number;
/**
 * PREFIX - QUEMADOS POR INDICACIONES DE SARTIP
 */
export declare const CURRENCY_PREFIX: {
    id: number;
    code: string;
    prefix: string;
}[];
export declare const getRandomNum: () => number;
export declare const labServicePattern: RegExp;
export declare const labFormPatter: RegExp;
export declare function capitalLetter(str?: string): string;
export declare const sortByProperty: (array: any[], property: string) => any[];
/**
 * Handle web app table actions and return a response with a consistent format.
 * @param action A function that returns a Promise of type T.
 * @returns A Promise of AxiosUtilsResponse<T>.
 */
export declare function handlePossibleAxiosErrors<T>(action: () => Promise<T>): Promise<AxiosUtilsResponse<T>>;
