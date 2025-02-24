import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FormSavedData = {
  formSavedData: {
    [key: string]: {
      //formName
      [key: string]: any; //fieldName and value
    };
  };
};

const initialState: FormSavedData = {
  formSavedData: {},
};

const formSavedDataSlice = createSlice({
  name: "formSavedData",
  initialState,
  reducers: {
    setFormFieldSavedData: (
      state,
      action: PayloadAction<{ formName: string; name: string; value: any }>
    ) => {
      state.formSavedData[action.payload.formName][action.payload.name] =
        action.payload.value;
    },
  },
});

export const { setFormFieldSavedData } = formSavedDataSlice.actions;

export default formSavedDataSlice.reducer;
