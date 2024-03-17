import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FormValidations = {
  formValidations: {
    [key: string]: {
      //formName
      [key: string]: string; //fieldName
    };
  };
};

const initialState: FormValidations = {
  formValidations: {},
};

const formValidationsSlice = createSlice({
  name: "formValidations",
  initialState,
  reducers: {
    setFieldError: (
      state,
      action: PayloadAction<{ formName: string; name: string; error: string }>
    ) => {
      state.formValidations[action.payload.formName][action.payload.name] =
        action.payload.error;
    },
  },
});

export const { setFieldError } = formValidationsSlice.actions;

export default formValidationsSlice.reducer;
