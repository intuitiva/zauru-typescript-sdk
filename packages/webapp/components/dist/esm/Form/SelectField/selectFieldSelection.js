export function isSelectableChoice(option) {
    return option != null && option.disabled !== true;
}
export function choiceAtIndex(options, index) {
    if (!Number.isInteger(index) || index < 0 || index >= options.length) {
        return undefined;
    }
    return options[index] ?? undefined;
}
export function highlightedIndexAfterOptionsChange(highlightedIndex, nextLength) {
    if (highlightedIndex < 0 || nextLength <= 0) {
        return -1;
    }
    if (highlightedIndex >= nextLength) {
        return -1;
    }
    return highlightedIndex;
}
export function nextHighlightedIndex(current, length, direction) {
    if (length <= 0) {
        return -1;
    }
    if (direction === "down") {
        return current < length - 1 ? current + 1 : 0;
    }
    return current > 0 ? current - 1 : length - 1;
}
export function resolveEnterSelection(options, highlightedIndex) {
    if (highlightedIndex === -1) {
        return undefined;
    }
    const option = choiceAtIndex(options, highlightedIndex);
    return isSelectableChoice(option) ? option : undefined;
}
export function resolveTabBlurSelection({ options, highlightedIndex, isSearching, }) {
    if (highlightedIndex >= 0) {
        const highlighted = choiceAtIndex(options, highlightedIndex);
        return isSelectableChoice(highlighted) ? highlighted : undefined;
    }
    if (!isSearching) {
        return undefined;
    }
    const first = choiceAtIndex(options, 0);
    return isSelectableChoice(first) ? first : undefined;
}
