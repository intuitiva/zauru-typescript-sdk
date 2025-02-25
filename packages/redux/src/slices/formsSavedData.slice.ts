import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FormSavedData = {
  [key: string]: {
    //formName
    [key: string]: any; //fieldName and value
  };
};

const initialState: FormSavedData = {};

const formSavedDataSlice = createSlice({
  name: "formSavedData",
  initialState,
  reducers: {
    setFormFieldSavedData: (
      state,
      action: PayloadAction<{ formName: string; name: string; value: any }>
    ) => {
      if (!state[action.payload.formName]) {
        state[action.payload.formName] = {};
      }
      state[action.payload.formName][action.payload.name] =
        action.payload.value;
    },
  },
});

export const { setFormFieldSavedData } = formSavedDataSlice.actions;

export default formSavedDataSlice.reducer;
