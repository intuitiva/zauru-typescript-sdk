import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { SpecialItem, WebAppRowGraphQL } from "@zauru-sdk/types";

export interface WebAppTableState {
  specialItems: WebAppRowGraphQL<SpecialItem>[];
  loadingSpecialItems: boolean;
}

const initialState: WebAppTableState = {
  specialItems: [],
  loadingSpecialItems: false,
};

const webappTablesSlice = createSlice({
  name: "webappTables",
  initialState,
  reducers: {
    setLoadingSpecialItems: (state, action: PayloadAction<boolean>) => {
      state.loadingSpecialItems = action.payload;
    },
    setSpecialItems: (
      state,
      action: PayloadAction<WebAppRowGraphQL<SpecialItem>[]>
    ) => {
      state.specialItems = action.payload;
      state.loadingSpecialItems = false;
    },
  },
});

export const { setLoadingSpecialItems, setSpecialItems } =
  webappTablesSlice.actions;

export default webappTablesSlice.reducer;
