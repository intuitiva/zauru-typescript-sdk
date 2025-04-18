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
 * todayLongString
 * @param date
 * @returns
 */
export declare function todayLongString(hours?: boolean): string;
export declare function isToday(dateStr: string): boolean;
export declare const getDatePickerCurrentDate: () => string;
export declare const obtenerFechaActualConZonaHoraria: (zonaHoraria: "America/Guatemala") => string;
export declare const getTimePickerCurrentTime: () => string;
export declare const getDateAfterDays: (daysAfterToday: number) => string;
export declare const getPayeeFormated: (payee?: PayeeGraphQL) => string;
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
/**
 * IMPORTANTE: Esta función está diseñada para funcionar solo en el lado del cliente.
 * Para renderizado del lado del servidor, utilice una función alternativa.
 *
 * Función para obtener la fecha formateada en español
 * @param dateString - Cadena de fecha opcional
 * @param withHours - Indica si se debe incluir la hora en el formato
 * @returns Fecha formateada en español
 */
export declare const getFormattedDate: (dateString?: string, withHours?: boolean) => string;
export declare const formatDateToDatePicker: (date: Date) => string;
export declare const formatTimeToTimePicker: (timeString: string) => Date;
export declare const toFixedIfNeeded: (value: number) => string | number;
export declare const isNumeric: (value: any) => boolean;
export declare function incrementString(str: string): string;
export declare function getParsedIdFromString(inputString: string): number;
export declare const arrayToObject: (arr?: Array<any>, options?: {
    withOutId?: boolean;
}) => {
    [key: string]: any;
};
export declare const priceToText: (value: number | string) => string;
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
export declare function handlePossibleAxiosErrors<T>(action: () => Promise<T>, timeout?: number): Promise<AxiosUtilsResponse<T>>;
/**
 * createPostgresUrl
 * @param host
 * @param port
 * @param dbName
 * @param user
 * @param password
 * @param schema
 * @returns
 */
export declare function createPostgresUrl(host?: any, port?: any, dbName?: any, user?: any, password?: any, schema?: any): string;
export declare const parsedObject: (obj: any) => any;
export declare function calculateTimeDifference(timestamp: string): {
    hours: number;
    minutes: number;
    label: string;
};
/**
 * Creates a unique code with a compact date format in uppercase.
 *
 * @param {string | null} suffix - An optional prefix to add to the code.
 * @returns {string} A unique code consisting of a timestamp and an optional suffix.
 *
 * @example
 * // Without suffix
 * createCode(null); // Returns something like "1A2B3C4D"
 *
 * @example
 * // With suffix
 * createCode("INV"); // Returns something like "INV-1A2B3C4D"
 */
export declare function createCode(suffix?: string | null): string;
/**
 * Parses a code generated by createCode function to extract its components.
 *
 * @param {string} code - The code to parse.
 * @returns {Object} An object containing the parsed date and suffix (if any).
 * @property {Date} date - The date represented by the timestamp in the code.
 * @property {string | null} suffix - The suffix of the code, if present; otherwise null.
 *
 * @example
 * // Parsing a code without suffix
 * parseCode("1A2B3C4D");
 * // Returns { date: Date object, suffix: null }
 *
 * @example
 * // Parsing a code with suffix
 * parseCode("INV-1A2B3C4D");
 * // Returns { date: Date object, suffix: "INV" }
 */
export declare function parseCode(code: string): {
    date: Date;
    suffix: string | null;
};
