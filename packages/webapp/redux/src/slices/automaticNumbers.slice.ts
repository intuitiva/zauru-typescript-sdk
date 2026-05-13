import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type AUTOMATIC_NUMBER_NAMES =
  | "dischargeIdNumber"
  | "purchaseOrderIdNumber";

export interface AutomaticNumberState {
  purchaseOrderIdNumber: { loading: boolean; data: number | string };
  dischargeIdNumber: { loading: boolean; data: number | string };
}

const initialState: AutomaticNumberState = {
  purchaseOrderIdNumber: { data: "", loading: false },
  dischargeIdNumber: { data: "NCB00000", loading: false },
};

const automaticNumbersSlice = createSlice({
  name: "automaticNumbers",
  initialState,
  reducers: {
    automaticNumberFetchStart: (
      state,
      action: PayloadAction<AUTOMATIC_NUMBER_NAMES>
    ) => {
      state[action.payload].loading = true;
    },
    automaticNumberFetchSuccess: (
      state,
      action: PayloadAction<{ name: AUTOMATIC_NUMBER_NAMES; data: any }>
    ) => {
      state[action.payload.name].data = action.payload.data;
      state[action.payload.name].loading = false;
    },
  },
});

export const { automaticNumberFetchStart, automaticNumberFetchSuccess } =
  automaticNumbersSlice.actions;

export default automaticNumbersSlice.reducer;
