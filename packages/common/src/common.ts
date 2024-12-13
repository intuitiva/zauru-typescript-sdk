import moment from "moment";
import "moment-timezone";
import type {
  PayeeGraphQL,
  AxiosUtilsResponse,
  BasketSchema,
  SelectFieldOption,
  MonthsType,
} from "@zauru-sdk/types";
import { MONTHS } from "@zauru-sdk/types";

export const DESTINOS_MUESTRA_OPTIONS: SelectFieldOption[] = [
  { label: "Microbiología", value: "microbiologa" },
  { label: "Residuos de plaguicidas", value: "residuos_de_plaguicidas" },
];

moment.locale("es");

/**
 * Obtener el objeto de canastas en base al string de canastas
 * @param basketsString
 * @returns
 */
export const getBasketsSchema = (basketsString: string): BasketSchema[] => {
  //Sacar conteo de canastas y su descripción de colores
  //ejemplo: vienen en un campo así: 8-53311-VERDE,3-53315-ROSADA,4-53313-ROJA
  const splitedText = basketsString.split(",");
  const baskets = splitedText.map((splited: string) => {
    const values = splited.split("-");
    return {
      total: Number(values[0]) ?? 0,
      id: Number(values[1]) ?? 0,
      color: values[2] ?? "Sin Canasta",
    } as BasketSchema;
  });

  return baskets;
};

export function generateClientUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * extractValueBetweenTags
 * @param input
 * @param tagName
 * @returns
 */
export function extractValueBetweenTags(
  input: string,
  tagName: string
): string {
  const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\\/${tagName}>`, "i");
  const match = input.match(regex);
  return match ? match[1] : "";
}

/**
 * isJsonArray
 * @param value
 * @returns
 */
export function isJsonArray(value: string): boolean {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed);
  } catch (e) {
    return false;
  }
}

/**
 *
 * @param date Recibe el date en formato UTC
 */
export const getFechaJuliana = (date: string): string => {
  function getDaysInMonth(month: number): number {
    return new Date(new Date().getFullYear(), month, 0).getDate();
  }

  const getNumberOfDays = (month: number, day: number): number => {
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
export const getNewDateByFormat = (date: string): Date => {
  if (!date) {
    return new Date();
  }
  const date_parts: string[] = date.split(" ");

  const new_date = new Date(
    parseInt(date_parts[4]),
    MONTHS[date_parts[2] as keyof MonthsType],
    parseInt(date_parts[0])
  );
  return new_date;
};

/**
 * Convierte una fecha de tipo 25 de jul de 2022 a YYYY-MM-DD
 * @param date
 * @returns
 */
export const getZauruDateByText = (date: string) => {
  const newDate = getNewDateByFormat(date);
  return getStringDate(newDate);
};

/**
 * Convierte una fecha de tipo Date a YYYY-MM-DD
 * @param date
 * @returns
 */
export const getStringDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();
  return `${year}-${month <= 9 ? `0${month}` : month}-${
    day <= 9 ? `0${day}` : day
  }`;
};

export function truncateText(text?: string, maxLength?: number) {
  if (!text || !maxLength) {
    return "";
  }
  // Verificar si el texto es más largo que maxLength
  if (text.length > maxLength) {
    // Si es así, truncar el texto y agregar "..."
    return text.substring(0, maxLength - 3) + "...";
  } else {
    // Si no, devolver el texto completo
    return text;
  }
}

export const getTodayDaysDifference = (date: string): number => {
  // Crear el objeto de Moment para la fecha de creación
  const fechaCreacion = moment(date);
  // Crear el objeto de Moment para la fecha actual
  const ahora = moment();
  // Calcular la diferencia en días
  const diferencia = ahora.diff(fechaCreacion, "days");
  return diferencia;
};

export const getTodayMinutesDifference = (date: string): number => {
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
export const getStringFullDate = (date: Date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();
  return `${day <= 9 ? `0${day}` : day}-${
    month <= 9 ? `0${month}` : month
  }-${year} ${hour}:${minutes}:${seconds}`;
};

/**
 * Convierte una fecha de tipo DD/MM/YYYY a YYYY/MM/DD
 * @param dateStr
 * @returns
 */
export const localDateToUSDate = (dateStr: string) => {
  const date = moment(dateStr, "DD/MM/YYYY");
  const newDateStr = date.format("YYYY/MM/DD");
  return newDateStr;
};

export const stringDateToParsedUTCDate = (date: string): Date => {
  const issueDate = new Date(date);
  issueDate.setMinutes(issueDate.getMinutes() - 360);
  return issueDate;
};

/**
 * todayLongString
 * @param date
 * @returns
 */
export function todayLongString(hours: boolean = false) {
  // Analiza la fecha y hora sin ajustes de zona horaria
  const issueDate = moment(new Date().toISOString());

  let formatString = "dddd, D [de] MMMM [de] YYYY";
  if (hours) {
    formatString += ", HH:mm a"; // Añade la hora en formato de 12 horas con AM/PM
  }

  // Formatea la fecha en el locale español
  return issueDate.locale("es").format(formatString);
}

export function isToday(dateStr: string): boolean {
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

export const obtenerFechaActualConZonaHoraria = (
  zonaHoraria: "America/Guatemala"
) => {
  const fecha = new Date();
  const opciones: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: zonaHoraria,
  };

  const fechaFormateada = new Intl.DateTimeFormat("es-ES", opciones).format(
    fecha
  );
  const [dia, mes, anio] = fechaFormateada.split("/");

  return `${anio}-${mes}-${dia}`;
};

export const getTimePickerCurrentTime = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const getDateAfterDays = (daysAfterToday: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAfterToday); // Agregamos el número de días a la fecha actual.

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getPayeeFormated = (payee?: PayeeGraphQL) => {
  if (!payee) return "-";
  return `${payee.id_number ? `<${payee.id_number}> ` : ""}${
    payee.tin ? `${payee.tin} | ` : ""
  }${payee.name}`.trim();
};

export const getPayeeInfoIdOptions = (
  payees: PayeeGraphQL[]
): (SelectFieldOption & { id: number })[] => {
  return payees.map((x) => {
    return {
      label: `${x.id_number ? `<${x.id_number}> ` : ""}${
        x.tin ? `${x.tin} | ` : ""
      }${x.name}`.trim(),
      value: x.id,
      id: x.id,
    } as SelectFieldOption & { id: number };
  });
};

export const getPayeeInfoOptions = (
  payees: PayeeGraphQL[]
): (SelectFieldOption & { id: number })[] => {
  return payees.map((x) => {
    return {
      label: `${x.id_number ? `<${x.id_number}> ` : ""}${
        x.tin ? `${x.tin} | ` : ""
      }${x.name}`.trim(),
      value: `${x.id_number ? `<${x.id_number}> ` : ""}${
        x.tin ? `${x.tin} | ` : ""
      }${x.name}`.trim(),
      id: x.id,
    } as SelectFieldOption & { id: number };
  });
};

export const parsedBaculoFormValue = (
  value: any,
  config: { trueValue: string; falseValue: string } = {
    falseValue: "No",
    trueValue: "Si",
  }
) => {
  if (value === "false") {
    return config.falseValue;
  } else if (value === "true") {
    return config.trueValue;
  } else if (DESTINOS_MUESTRA_OPTIONS.some((x) => x.value === value)) {
    return DESTINOS_MUESTRA_OPTIONS.find((x) => x.value === value)?.label;
  } else if (moment(value, "YYYY-MM-DD", true).isValid()) {
    // Valida y convierte la fecha
    return moment(value).format("DD/MM/YYYY");
  }

  return capitalLetter(value);
};

export function extractIdFromForm(s: string): number | null {
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
export function formatDateToUTC(dateString: string): string {
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

/**
 * IMPORTANTE: Esta función está diseñada para funcionar solo en el lado del cliente.
 * Para renderizado del lado del servidor, utilice una función alternativa.
 *
 * Función para obtener la fecha formateada en español
 * @param dateString - Cadena de fecha opcional
 * @param withHours - Indica si se debe incluir la hora en el formato
 * @returns Fecha formateada en español
 */
export const getFormattedDate = (
  dateString?: string,
  withHours: boolean = true
) => {
  let date: Date;

  if (dateString) {
    // Detectar el formato de la fecha
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/.test(dateString)) {
      // Formato ISO (UTC o local)
      if (dateString.endsWith("Z")) {
        // ISO con UTC (Z)
        date = new Date(dateString); // El constructor ya maneja UTC
      } else {
        // ISO sin UTC (hora local)
        date = new Date(dateString);
        // Ajustar a la hora local
        date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      }
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      // Formato YYYY-MM-DD
      date = new Date(`${dateString}T00:00:00`); // Hora local
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      // Formato DD-MM-YYYY
      const [day, month, year] = dateString.split("-");
      date = new Date(`${year}-${month}-${day}T00:00:00`); // Hora local
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      // Formato DD/MM/YYYY
      const [day, month, year] = dateString.split("/");
      date = new Date(`${year}-${month}-${day}T00:00:00`); // Hora local
    } else {
      throw new Error("Formato de fecha no reconocido");
    }
  } else {
    date = new Date(); // Fecha actual en hora local
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Obtiene la zona horaria del usuario
  };

  if (withHours) {
    options.hour = "numeric";
    options.minute = "numeric";
    options.second = "numeric";
    options.hour12 = false;
  }

  return new Intl.DateTimeFormat("es-ES", options).format(date);
};

export const formatDateToDatePicker = (date: Date) => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // Los meses van de 0 a 11, así que le sumamos 1
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};

export const formatTimeToTimePicker = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // Establecemos las horas y minutos, y reseteamos segundos y milisegundos

  return date;
};

export const toFixedIfNeeded = (value: number) => {
  if (!value) {
    return value;
  }

  if (Number.isInteger(value)) {
    return value.toString().replace(".00", "");
  }

  const decimals = (value.toString().split(".")[1] || []).length;

  const decimal = decimals > 2 ? value.toFixed(2) : value.toString();

  return decimal.replace(".00", "");
};

export const isNumeric = (value: any) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export function incrementString(str: string): string {
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

export function getParsedIdFromString(inputString: string): number {
  const regex = /<(\d+)>/; // Expresión regular para encontrar el número entre los corchetes

  const match = inputString.match(regex); // Buscar la coincidencia en el string

  let number = 0;
  if (match && match[1]) {
    number = parseInt(match[1]); // Convertir el número de string a entero
    //console.log(number); // Mostrar el número en la consola
  } else {
    console.log("No se encontró ningún número entre corchetes.");
  }

  return number;
}

export const arrayToObject = (
  arr: Array<any> = [],
  options?: { withOutId?: boolean }
): { [key: string]: any } => {
  return arr.reduce((acc, cur, idx) => {
    const tempVal = cur;
    if (options?.withOutId) {
      delete tempVal.id;
    }
    acc[idx.toString()] = tempVal;
    return acc;
  }, {});
};

export function convertToFormData(obj: any) {
  const formData = new FormData();

  function appendFormData(data: any, root = "") {
    if (data && typeof data === "object" && !(data instanceof File)) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (root === "") {
            // Append nested objects
            if (data[key] != undefined && data[key] != null)
              appendFormData(data[key], key);
          } else {
            // Append data with namespaced keys for nested objects
            if (data[key] != undefined && data[key] != null)
              appendFormData(data[key], `${root}[${key}]`);
          }
        }
      }
    } else {
      if (data instanceof File) {
        formData.append(root, data, data.name);
      } else {
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
export function reduceAdd(accumulator: number, a: number) {
  return accumulator + a;
}

/**
 * Truncar decimales, ejemplo: truncateDecimals(43.434340934, 2) => 43.43
 * @param number
 * @param digits
 * @returns
 */
export const truncateDecimals = function (
  number: number,
  digits: number
): number {
  const multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);

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

export const getRandomNum = (): number => {
  const randomNum = Math.random() * 10 + 1;
  return parseFloat(randomNum.toFixed(2));
};

//COMMONS DE LABORATORIO
export const labServicePattern = /LAB_SERVICE_\d+;/g;
export const labFormPatter = /LAB_FORM_\d+;/;

export function capitalLetter(str: string = "") {
  if (str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}

export const sortByProperty = (array: any[], property: string) => {
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
export async function handlePossibleAxiosErrors<T>(
  action: () => Promise<T>
): Promise<AxiosUtilsResponse<T>> {
  const SECONDS_TO_TIMEOUT = 20;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(`Timeout skipped after ${SECONDS_TO_TIMEOUT} seconds`)
        ),
      SECONDS_TO_TIMEOUT * 1000
    )
  );

  try {
    const result = await Promise.race([action(), timeoutPromise]);
    return { error: false, data: result } as AxiosUtilsResponse<T>;
  } catch (error) {
    return { error: true, userMsg: error?.toString() } as AxiosUtilsResponse<T>;
  }
}

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
export function createPostgresUrl(
  host: any = "localhost",
  port: any = "5432",
  dbName: any = "postgres",
  user: any = "postgres",
  password: any = "",
  schema: any = "public"
) {
  let authPart = user;
  if (password) {
    authPart += `:${password}`;
  }

  return `postgresql://${authPart}@${host}:${port}/${dbName}?schema=${schema}`;
}

export const parsedObject = (obj: any): any => {
  if (typeof obj === "bigint") {
    return obj.toString();
  } else if (obj instanceof Date) {
    return obj.toISOString();
  } else if (Array.isArray(obj)) {
    return obj.map(parsedObject);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, parsedObject(value)])
    );
  } else {
    return obj;
  }
};

export function calculateTimeDifference(timestamp: string): {
  hours: number;
  minutes: number;
  label: string;
} {
  const currentTime = moment();
  const inputTime = moment(timestamp, "YYYY-MM-DD HH:mm:ss");

  if (!inputTime.isValid()) {
    return { hours: 0, minutes: 0, label: `---` };
  }

  const duration = moment.duration(currentTime.diff(inputTime));
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) % 60;

  return {
    hours: hours,
    minutes: minutes,
    label: `${hours > 0 ? `${hours} ${hours > 1 ? "horas" : "hora"}` : ""}${
      hours > 0 && minutes > 0 ? " y " : ""
    }${minutes > 0 ? `${minutes} ${minutes > 1 ? "minutos" : "minuto"}` : ""}.`,
  };
}

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
export function createCode(suffix?: string | null): string {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(36)
    .toUpperCase(); // Timestamp in base 36 and converted to uppercase
  const code = `${timestamp}`;

  return suffix ? `${suffix}-${code}` : code;
}

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
export function parseCode(code: string) {
  // Check if the code has a suffix
  const hasSuffix = code.includes("-") && isNaN(Number(code.split("-")[0]));
  const [suffixOrTimestamp, timestamp] = code.split("-");

  const dateTimestamp = hasSuffix ? timestamp : suffixOrTimestamp;
  const date = new Date(parseInt(dateTimestamp, 36) * 1000); // Convert the timestamp back to milliseconds

  return {
    date: date,
    suffix: hasSuffix ? suffixOrTimestamp : null, // Only return the suffix if it exists
  };
}
