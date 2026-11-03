import type { JsonMemoType, RadicchioBoxes, RadicchioConversionMemo } from "@zauru-sdk/types";
export type RadicchioConversionCalculation = {
    boxes: RadicchioBoxes;
    packedUnits: number;
    remainingUnits: number;
    totalBoxes: number;
};
export declare const emptyRadicchioBoxes: () => RadicchioBoxes;
export declare const calculateRadicchioConversion: (receivedUnits: number, boxes: RadicchioBoxes) => RadicchioConversionCalculation;
export declare const validateRadicchioConversion: (receivedUnits: number, boxes: RadicchioBoxes, remainderReason?: string) => string[];
/**
 * Splits a converted box total across original weighing lines while preserving
 * the exact total. Floors every proportional share, then assigns the remaining
 * boxes to the largest fractional residues (stable by original line order).
 */
export declare const allocateRadicchioBoxesByLine: (totalBoxes: number, lineUnits: number[]) => number[];
export declare const getRadicchioOriginalLines: (memo: JsonMemoType) => number[];
export declare const isRadicchioConversionMemo: (value: unknown) => value is RadicchioConversionMemo;
