import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type TEMPLATE_NAMES = "receptionTemplate";

export interface TemplateState {
  receptionTemplate: { loading: boolean; data: string };
}

const initialState: TemplateState = {
  receptionTemplate: { data: "", loading: false },
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    templateFetchStart: (state, action: PayloadAction<TEMPLATE_NAMES>) => {
      state[action.payload].loading = true;
    },
    templateFetchSuccess: (
      state,
      action: PayloadAction<{ name: TEMPLATE_NAMES; data: any }>
    ) => {
      state[action.payload.name].data = action.payload.data;
      state[action.payload.name].loading = false;
    },
  },
});

export const { templateFetchStart, templateFetchSuccess } =
  templateSlice.actions;

export default templateSlice.reducer;
