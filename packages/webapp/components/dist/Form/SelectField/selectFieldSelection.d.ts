import type { SelectFieldOption } from "@zauru-sdk/types";
export type SelectFieldChoice = SelectFieldOption & {
    disabled?: boolean;
    disabledLabel?: string;
};
export declare function isSelectableChoice(option: SelectFieldChoice | null | undefined): option is SelectFieldChoice;
export declare function choiceAtIndex(options: ReadonlyArray<SelectFieldChoice | null | undefined>, index: number): SelectFieldChoice | undefined;
export declare function highlightedIndexAfterOptionsChange(highlightedIndex: number, nextLength: number): number;
export declare function nextHighlightedIndex(current: number, length: number, direction: "down" | "up"): number;
export declare function resolveEnterSelection(options: ReadonlyArray<SelectFieldChoice | null | undefined>, highlightedIndex: number): SelectFieldChoice | undefined;
export declare function resolveTabBlurSelection({ options, highlightedIndex, isSearching, }: {
    options: ReadonlyArray<SelectFieldChoice | null | undefined>;
    highlightedIndex: number;
    isSearching: boolean;
}): SelectFieldChoice | undefined;
