import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  choiceAtIndex,
  highlightedIndexAfterOptionsChange,
  isSelectableChoice,
  nextHighlightedIndex,
  resolveEnterSelection,
  resolveTabBlurSelection,
  type SelectFieldChoice,
} from "./selectFieldSelection.js";

const option = (
  value: string,
  extra: Partial<SelectFieldChoice> = {},
): SelectFieldChoice => ({
  label: extra.label ?? value,
  value,
  ...extra,
});

const catalog: SelectFieldChoice[] = [
  option("central"),
  option("norte", { disabled: true, disabledLabel: "cerrada" }),
  option("sur"),
];

describe("isSelectableChoice", () => {
  it("When the option is missing, it should not be selectable", () => {
    assert.equal(isSelectableChoice(undefined), false);
    assert.equal(isSelectableChoice(null), false);
  });

  it("When the option is disabled, it should not be selectable", () => {
    assert.equal(isSelectableChoice(catalog[1]), false);
  });

  it("When the option is enabled, it should be selectable", () => {
    assert.equal(isSelectableChoice(catalog[0]), true);
    assert.equal(isSelectableChoice(catalog[2]), true);
  });
});

describe("choiceAtIndex", () => {
  it("When the index is in range, it should return that option", () => {
    assert.equal(choiceAtIndex(catalog, 2)?.value, "sur");
  });

  it("When the index is stale after options shrink, it should return undefined", () => {
    assert.equal(choiceAtIndex(catalog.slice(0, 1), 2), undefined);
    assert.equal(choiceAtIndex(catalog, -1), undefined);
    assert.equal(choiceAtIndex([], 0), undefined);
  });

  it("When the slot is empty, it should return undefined", () => {
    assert.equal(choiceAtIndex([catalog[0], undefined, catalog[2]], 1), undefined);
  });
});

describe("highlightedIndexAfterOptionsChange", () => {
  it("When the highlighted option still exists, it should keep the index", () => {
    assert.equal(highlightedIndexAfterOptionsChange(1, 3), 1);
  });

  it("When options shrink past the highlight, it should clear it", () => {
    assert.equal(highlightedIndexAfterOptionsChange(8, 3), -1);
    assert.equal(highlightedIndexAfterOptionsChange(0, 0), -1);
  });

  it("When nothing is highlighted, it should stay cleared", () => {
    assert.equal(highlightedIndexAfterOptionsChange(-1, 10), -1);
  });
});

describe("nextHighlightedIndex", () => {
  it("When moving down, it should wrap to the first option", () => {
    assert.equal(nextHighlightedIndex(2, 3, "down"), 0);
    assert.equal(nextHighlightedIndex(-1, 3, "down"), 0);
  });

  it("When moving up, it should wrap to the last option", () => {
    assert.equal(nextHighlightedIndex(0, 3, "up"), 2);
    assert.equal(nextHighlightedIndex(-1, 3, "up"), 2);
  });

  it("When there are no options, it should not highlight an empty slot", () => {
    assert.equal(nextHighlightedIndex(0, 0, "down"), -1);
    assert.equal(nextHighlightedIndex(4, 0, "up"), -1);
  });
});

describe("resolveEnterSelection", () => {
  it("When Enter is pressed on an enabled option, it should select it", () => {
    assert.equal(resolveEnterSelection(catalog, 2)?.value, "sur");
  });

  it("When Enter is pressed on a disabled option, it should select nothing", () => {
    assert.equal(resolveEnterSelection(catalog, 1), undefined);
  });

  it("When Enter is pressed after options shrink, it should not throw and select nothing", () => {
    assert.equal(resolveEnterSelection(catalog.slice(0, 1), 8), undefined);
    assert.equal(resolveEnterSelection(catalog, -1), undefined);
  });
});

describe("resolveTabBlurSelection", () => {
  it("When Tab leaves a highlighted enabled option, it should select that option", () => {
    assert.equal(
      resolveTabBlurSelection({
        options: catalog,
        highlightedIndex: 2,
        isSearching: false,
      })?.value,
      "sur",
    );
  });

  it("When Tab leaves a stale highlight, it should not fall back to the first option", () => {
    assert.equal(
      resolveTabBlurSelection({
        options: catalog.slice(0, 1),
        highlightedIndex: 8,
        isSearching: true,
      }),
      undefined,
    );
  });

  it("When Tab leaves a disabled highlight, it should select nothing", () => {
    assert.equal(
      resolveTabBlurSelection({
        options: catalog,
        highlightedIndex: 1,
        isSearching: true,
      }),
      undefined,
    );
  });

  it("When Tab leaves a search with no highlight, it should select the first enabled match", () => {
    assert.equal(
      resolveTabBlurSelection({
        options: catalog,
        highlightedIndex: -1,
        isSearching: true,
      })?.value,
      "central",
    );
  });

  it("When Tab leaves without searching or highlighting, it should select nothing", () => {
    assert.equal(
      resolveTabBlurSelection({
        options: catalog,
        highlightedIndex: -1,
        isSearching: false,
      }),
      undefined,
    );
  });

  it("When the first search match is disabled, it should not select it", () => {
    assert.equal(
      resolveTabBlurSelection({
        options: [catalog[1], catalog[2]],
        highlightedIndex: -1,
        isSearching: true,
      }),
      undefined,
    );
  });
});
