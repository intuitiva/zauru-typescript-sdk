/**
 * Identity helper that gives a typed config object back. Apps typically extend
 * `BaseAppocusConfig` with their own `copy` keys and pass the merged object.
 */
export function defineAppocusConfig(cfg) {
    return cfg;
}
