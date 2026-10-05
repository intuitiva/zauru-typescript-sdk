export const DEFAULT_SUPER_ADMIN_EMAIL_SUFFIXES = [
    "@zauru.com",
    "@intuitiva.biz",
];
export function flattenPermissionRows(groups) {
    return groups.flatMap((group) => group.actions.map((action) => ({
        groupId: group.id,
        groupLabel: group.label,
        key: action.key,
        label: action.label,
    })));
}
export function allPermissionKeysFromGroups(groups) {
    return flattenPermissionRows(groups).map((row) => row.key);
}
export function isValidPermissionKey(key, validKeys) {
    if (Array.isArray(validKeys)) {
        return validKeys.includes(key);
    }
    return validKeys.has(key);
}
export function normalizePermissionKeys(value) {
    if (Array.isArray(value)) {
        return value.filter((key) => typeof key === "string");
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) {
            return [];
        }
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.filter((key) => typeof key === "string");
            }
        }
        catch {
            return [trimmed];
        }
    }
    return [];
}
export function normalizeIdList(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item > 0);
}
export function togglePermissionKey(keys, key, granted) {
    const next = new Set(keys);
    if (granted) {
        next.add(key);
    }
    else {
        next.delete(key);
    }
    return [...next];
}
export function addPermissionKeys(keys, add) {
    return [...new Set([...keys, ...add])];
}
export function removePermissionKeys(keys, remove) {
    const drop = new Set(remove);
    return keys.filter((key) => !drop.has(key));
}
