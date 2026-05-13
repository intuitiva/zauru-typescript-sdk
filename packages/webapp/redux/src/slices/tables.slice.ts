import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type TABLE_NAMES = "pageTable1" | "pageTable2" | "pageTable3";

export interface TableState {
  pageTable1: number;
  pageTable2: number;
  pageTable3: number;
}

const initialState: TableState = {
  pageTable1: 1,
  pageTable2: 1,
  pageTable3: 1,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    tableSetPage: (
      state,
      action: PayloadAction<{ name: TABLE_NAMES; data: number }>
    ) => {
      state[action.payload.name] = action.payload.data;
    },
  },
});

export const { tableSetPage } = tableSlice.actions;

export default tableSlice.reducer;
