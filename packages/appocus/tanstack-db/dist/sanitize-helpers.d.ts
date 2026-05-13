/**
 * Convert an unknown value to `Date | null`. Accepts ISO strings, Dates, or nullish.
 */
export declare function toDateOrNull(value: unknown): Date | null;
/**
 * Convert an unknown value to `number | null`. Accepts numeric strings, numbers, or nullish.
 */
export declare function toNumberOrNull(value: unknown): number | null;
/**
 * Convert an unknown value to `string | null`. If the value is an object with a `.url`
 * property (e.g. Zauru image payloads), returns that URL.
 */
export declare function toStringOrNull(value: unknown): string | null;
