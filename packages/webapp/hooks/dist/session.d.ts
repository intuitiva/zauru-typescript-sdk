export type SERVER_CONFIG_TYPES = "sessionAttribute" | "environment" | "sessionVariable";
/**
 *
 * @param attribute
 * @returns
 */
export declare const useGetSessionAttribute: (name: string, type: SERVER_CONFIG_TYPES) => string;
