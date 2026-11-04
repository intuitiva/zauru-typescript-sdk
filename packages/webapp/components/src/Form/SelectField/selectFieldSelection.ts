import type { SelectFieldOption } from "@zauru-sdk/types";

export type SelectFieldChoice = SelectFieldOption & {
  disabled?: boolean;
  disabledLabel?: string;
};

export function isSelectableChoice(
  option: SelectFieldChoice | null | undefined,
): option is SelectFieldChoice {
  return option != null && option.disabled !== true;
}

export function choiceAtIndex(
  options: ReadonlyArray<SelectFieldChoice | null | undefined>,
  index: number,
): SelectFieldChoice | undefined {
  if (!Number.isInteger(index) || index < 0 || index >= options.length) {
    return undefined;
  }
  return options[index] ?? undefined;
}

export function highlightedIndexAfterOptionsChange(
  highlightedIndex: number,
  nextLength: number,
): number {
  if (highlightedIndex < 0 || nextLength <= 0) {
    return -1;
  }
  if (highlightedIndex >= nextLength) {
    return -1;
  }
  return highlightedIndex;
}

export function nextHighlightedIndex(
  current: number,
  length: number,
  direction: "down" | "up",
): number {
  if (length <= 0) {
    return -1;
  }
  if (direction === "down") {
    return current < length - 1 ? current + 1 : 0;
  }
  return current > 0 ? current - 1 : length - 1;
}

export function resolveEnterSelection(
  options: ReadonlyArray<SelectFieldChoice | null | undefined>,
  highlightedIndex: number,
): SelectFieldChoice | undefined {
  if (highlightedIndex === -1) {
    return undefined;
  }
  const option = choiceAtIndex(options, highlightedIndex);
  return isSelectableChoice(option) ? option : undefined;
}

export function resolveTabBlurSelection({
  options,
  highlightedIndex,
  isSearching,
}: {
  options: ReadonlyArray<SelectFieldChoice | null | undefined>;
  highlightedIndex: number;
  isSearching: boolean;
}): SelectFieldChoice | undefined {
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
