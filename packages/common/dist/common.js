import moment from "moment";
import "moment-timezone";
import "moment/locale/es";
import { MONTHS } from "@zauru-sdk/types";
export const DESTINOS_MUESTRA_OPTIONS = [
    { label: "Microbiología", value: "microbiologa" },
    { label: "Residuos de plaguicidas", value: "residuos_de_plaguicidas" },
];
moment.locale("es");
/**
 * Obtener el objeto de canastas en base al string de canastas
 * @param basketsString
 * @returns
 */
export const getBasketsSchema = (basketsString) => {
    //Sacar conteo de canastas y su descripción de colores
    //ejemplo: vienen en un campo así: 8-53311-VERDE,3-53315-ROSADA,4-53313-ROJA
    const splitedText = basketsString.split(",");
    const baskets = splitedText.map((splited) => {
        const values = splited.split("-");
        return {
            total: Number(values[0]) ?? 0,
            id: Number(values[1]) ?? 0,
            color: values[2] ?? "Sin Canasta",
        };
    });
    return baskets;
};
export function generateClientUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * extractValueBetweenTags
 * @param input
 * @param tagName
 * @returns
 */
export function extractValueBetweenTags(input, tagName) {
    const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\\/${tagName}>`, "i");
    const match = input.match(regex);
    return match ? match[1] : "";
}
/**
 * isJsonArray
 * @param value
 * @returns
 */
export function isJsonArray(value) {
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
    }
    catch (e) {
        return false;
    }
}
/**
 *
 * @param date Recibe el date en formato UTC
 */
export const getFechaJuliana = (date) => {
    function getDaysInMonth(month) {
        return new Date(new Date().getFullYear(), month, 0).getDate();
    }
    const getNumberOfDays = (month, day) => {
        let numberOfDays = day;
        while (month > 0) {
            const temp = getDaysInMonth(month);
            numberOfDays += temp;
            month--;
        }
        return numberOfDays;
    };
    const dt = moment(date).toDate();
    const month = dt.getMonth();
    const day = getNumberOfDays(month, dt.getDate());
    return `${dt.getFullYear()}-${day}`;
};
/**
 * Convierte una fecha de tipo 25 de jul de 2022 a Date
 * @param date
 * @returns
 */
export const getNewDateByFormat = (date) => {
    if (!date) {
        return new Date();
    }
    const date_parts = date.split(" ");
    const new_date = new Date(parseInt(date_parts[4]), MONTHS[date_parts[2]], parseInt(date_parts[0]));
    return new_date;
};
/**
 * Convierte una fecha de tipo 25 de jul de 2022 a YYYY-MM-DD
 * @param date
 * @returns
 */
export const getZauruDateByText = (date) => {
    const newDate = getNewDateByFormat(date);
    return getStringDate(newDate);
};
/**
 * Convierte una fecha de tipo Date a YYYY-MM-DD
 * @param date
 * @returns
 */
export const getStringDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    return `${year}-${month <= 9 ? `0${month}` : month}-${day <= 9 ? `0${day}` : day}`;
};
export function truncateText(text, maxLength) {
    if (!text || !maxLength) {
        return "";
    }
    // Verificar si el texto es más largo que maxLength
    if (text.length > maxLength) {
        // Si es así, truncar el texto y agregar "..."
        return text.substring(0, maxLength - 3) + "...";
    }
    else {
        // Si no, devolver el texto completo
        return text;
    }
}
export const getTodayDaysDifference = (date) => {
    // Crear el objeto de Moment para la fecha de creación
    const fechaCreacion = moment(date);
    // Crear el objeto de Moment para la fecha actual
    const ahora = moment();
    // Calcular la diferencia en días
    const diferencia = ahora.diff(fechaCreacion, "days");
    return diferencia;
};
export const getTodayMinutesDifference = (date) => {
    // Crear el objeto de Moment para la fecha de creación
    const fechaCreacion = moment(date);
    // Crear el objeto de Moment para la fecha actual
    const ahora = moment();
    // Calcular la diferencia en minutos
    const diferencia = ahora.diff(fechaCreacion, "minutes");
    return diferencia;
};
/**
 * Convierte una fecha de tipo Date a DD-MM-YYY HH:mm:ss
 * @param date
 * @returns
 */
export const getStringFullDate = (date) => {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    return `${day <= 9 ? `0${day}` : day}-${month <= 9 ? `0${month}` : month}-${year} ${hour}:${minutes}:${seconds}`;
};
/**
 * Convierte una fecha de tipo DD/MM/YYYY a YYYY/MM/DD
 * @param dateStr
 * @returns
 */
export const localDateToUSDate = (dateStr) => {
    const date = moment(dateStr, "DD/MM/YYYY");
    const newDateStr = date.format("YYYY/MM/DD");
    return newDateStr;
};
export const stringDateToParsedUTCDate = (date) => {
    const issueDate = new Date(date);
    issueDate.setMinutes(issueDate.getMinutes() - 360);
    return issueDate;
};
/**
 * zauruDateToLongString
 * @param date
 * @returns
 */
export function zauruDateToLongString(date, hours = false) {
    if (!date) {
        return "invalid date:zauruDateToLongString";
    }
    // Asume que la fecha de entrada está en UTC y la convierte a la zona horaria local del navegador
    const issueDate = moment.utc(date).local();
    let formatString = "dddd, D [de] MMMM [de] YYYY";
    if (hours) {
        formatString += ", HH:mm a"; // Añade la hora en formato de 12 horas con AM/PM
    }
    // Formatea la fecha en el locale español
    return issueDate.locale("es").format(formatString);
}
/**
 * todayLongString
 * @param date
 * @returns
 */
export function todayLongString(hours = false) {
    // Analiza la fecha y hora sin ajustes de zona horaria
    const issueDate = moment(new Date().toISOString());
    let formatString = "dddd, D [de] MMMM [de] YYYY";
    if (hours) {
        formatString += ", HH:mm a"; // Añade la hora en formato de 12 horas con AM/PM
    }
    // Formatea la fecha en el locale español
    return issueDate.locale("es").format(formatString);
}
export function isToday(dateStr) {
    // Parsea la fecha dada y la fecha actual a inicio del día (00:00:00)
    const givenDate = moment(dateStr).startOf("day");
    const today = moment().startOf("day");
    // Compara si son iguales
    return givenDate.isSame(today);
}
export const getDatePickerCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11, por eso sumamos 1.
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
export const getTimePickerCurrentTime = () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};
export const getDateAfterDays = (daysAfterToday) => {
    const date = new Date();
    date.setDate(date.getDate() + daysAfterToday); // Agregamos el número de días a la fecha actual.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
export const getPayeeFormated = (payee) => {
    return `<${payee.id_number}> ${payee.tin ? `${payee.tin} | ` : ""}${payee.name}`;
};
export const getPayeeInfoOptions = (payees) => {
    return payees.map((x) => {
        return {
            label: `<${x.id_number}> ${x.tin ? `${x.tin} | ` : ""}${x.name}`,
            value: `<${x.id_number}> ${x.tin ? `${x.tin} | ` : ""}${x.name}`,
            id: x.id,
        };
    });
};
export const parsedBaculoFormValue = (value) => {
    if (value === "false") {
        return "No";
    }
    else if (value === "true") {
        return "Si";
    }
    else if (DESTINOS_MUESTRA_OPTIONS.some((x) => x.value === value)) {
        return DESTINOS_MUESTRA_OPTIONS.find((x) => x.value === value)?.label;
    }
    return capitalLetter(value);
};
export function extractIdFromForm(s) {
    const match = s.match(/LAB_FORM_(\d+);/);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    }
    return null;
}
/**
 * Formatea una fecha de tipo YYYY-MM-DD a 2023-08-07T20:56:00.540245
 * @param dateString
 * @returns
 */
export function formatDateToUTC(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}
export const formatDateToDatePicker = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Los meses van de 0 a 11, así que le sumamos 1
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
};
export const formatTimeToTimePicker = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Establecemos las horas y minutos, y reseteamos segundos y milisegundos
    return date;
};
export const toFixedIfNeeded = (value) => {
    if (!value) {
        return "0";
    }
    if (Number.isInteger(value)) {
        return value.toString().replace(".00", "");
    }
    const decimals = (value.toString().split(".")[1] || []).length;
    const decimal = decimals > 2 ? value.toFixed(2) : value.toString();
    return decimal.replace(".00", "");
};
export const isNumeric = (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
};
export function incrementString(str) {
    // Encuentra la parte numérica de la cadena usando una expresión regular
    const match = str.match(/(\D*)(\d+)$/);
    if (!match) {
        throw new Error("Formato de cadena no válido");
    }
    const prefix = match[1];
    const numberPart = match[2];
    // Incrementa el número
    const incrementedNumber = parseInt(numberPart, 10) + 1;
    // Convierte el número incrementado de nuevo en una cadena y rellena con ceros
    const incrementedString = incrementedNumber
        .toString()
        .padStart(numberPart.length, "0");
    return prefix + incrementedString;
}
export function getParsedIdFromString(inputString) {
    const regex = /<(\d+)>/; // Expresión regular para encontrar el número entre los corchetes
    const match = inputString.match(regex); // Buscar la coincidencia en el string
    let number = 0;
    if (match && match[1]) {
        number = parseInt(match[1]); // Convertir el número de string a entero
        //console.log(number); // Mostrar el número en la consola
    }
    else {
        console.log("No se encontró ningún número entre corchetes.");
    }
    return number;
}
export const arrayToObject = (arr = [], options) => {
    return arr.reduce((acc, cur, idx) => {
        const tempVal = cur;
        if (options?.withOutId) {
            delete tempVal.id;
        }
        acc[idx.toString()] = tempVal;
        return acc;
    }, {});
};
export function convertToFormData(obj) {
    const formData = new FormData();
    function appendFormData(data, root = "") {
        if (data && typeof data === "object" && !(data instanceof File)) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (root === "") {
                        // Append nested objects
                        if (data[key] != undefined && data[key] != null)
                            appendFormData(data[key], key);
                    }
                    else {
                        // Append data with namespaced keys for nested objects
                        if (data[key] != undefined && data[key] != null)
                            appendFormData(data[key], `${root}[${key}]`);
                    }
                }
            }
        }
        else {
            if (data instanceof File) {
                formData.append(root, data, data.name);
            }
            else {
                formData.append(root, data);
            }
        }
    }
    appendFormData(obj);
    return formData;
}
export const ZAURU_REGEX = {
    porcentaje: /^\d{1,2}(\.\d{1,2})?$/,
};
/**
 * Para hacer sumas en los reduce de arreglos enteros
 * @param accumulator
 * @param a
 * @returns
 */
export function reduceAdd(accumulator, a) {
    return accumulator + a;
}
/**
 * Truncar decimales, ejemplo: truncateDecimals(43.434340934, 2) => 43.43
 * @param number
 * @param digits
 * @returns
 */
export const truncateDecimals = function (number, digits) {
    const multiplier = Math.pow(10, digits), adjustedNum = number * multiplier, truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);
    return truncatedNum / multiplier;
};
/**
 * PREFIX - QUEMADOS POR INDICACIONES DE SARTIP
 */
//TODO: Falta agregar los demás currencies
export const CURRENCY_PREFIX = [
    { id: 1, code: "GTQ", prefix: "Q" },
    { id: 2, code: "USD", prefix: "$" },
    { id: 3, code: "LHN", prefix: "L" },
    { id: 12, code: "MXN", prefix: "$" },
];
export const getRandomNum = () => {
    const randomNum = Math.random() * 10 + 1;
    return parseFloat(randomNum.toFixed(2));
};
//COMMONS DE LABORATORIO
export const labServicePattern = /LAB_SERVICE_\d+;/g;
export const labFormPatter = /LAB_FORM_\d+;/;
export function capitalLetter(str = "") {
    if (str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
}
export const sortByProperty = (array, property) => {
    // Crear una copia del array
    const arrayCopy = [...array];
    return arrayCopy.sort((a, b) => {
        if (a[property] > b[property]) {
            return 1;
        }
        if (a[property] < b[property]) {
            return -1;
        }
        return 0;
    });
};
/**
 * Handle web app table actions and return a response with a consistent format.
 * @param action A function that returns a Promise of type T.
 * @returns A Promise of AxiosUtilsResponse<T>.
 */
export async function handlePossibleAxiosErrors(action) {
    try {
        const result = await action();
        return { error: false, data: result };
    }
    catch (error) {
        return { error: true, userMsg: error?.toString() };
    }
}
