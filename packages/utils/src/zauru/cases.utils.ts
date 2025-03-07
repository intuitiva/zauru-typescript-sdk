import { CaseSupplyGraphQL } from "@zauru-sdk/types";

/**
 * makeCaseSuppliesWithPrice
 * @param case_supplies
 * @returns
 */
export const makeCaseSuppliesWithPrice = (
  case_supplies: any[],
  deleted_case_supplies: any[] = []
) => {
  return [
    ...case_supplies.map((x) => {
      const item_id = Number(x.item_id);

      const id = isNaN(x.id) ? undefined : x.id;
      return {
        id,
        item_id,
        quantity: Number(x.quantity),
        unit_price: Number(x.unit_price),
        reference: x.reference,
        _destroy: false,
      } as CaseSupplyGraphQL;
    }),
    ...deleted_case_supplies.map((x) => {
      return {
        id: x.id,
        _destroy: true,
      } as CaseSupplyGraphQL;
    }),
  ];
};
