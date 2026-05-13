/**
 * Convert an unknown value to `Date | null`. Accepts ISO strings, Dates, or nullish.
 */
export function toDateOrNull(value) {
    if (value == null)
        return null;
    if (value instanceof Date)
        return value;
    if (typeof value === "string")
        return new Date(value);
    return null;
}
/**
 * Convert an unknown value to `number | null`. Accepts numeric strings, numbers, or nullish.
 */
export function toNumberOrNull(value) {
    if (value == null)
        return null;
    const n = typeof value === "string" ? parseFloat(value) : Number(value);
    return isNaN(n) ? null : n;
}
/**
 * Convert an unknown value to `string | null`. If the value is an object with a `.url`
 * property (e.g. Zauru image payloads), returns that URL.
 */
export function toStringOrNull(value) {
    if (value == null)
        return null;
    if (typeof value === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return value?.url ?? null;
    }
    return String(value);
}
