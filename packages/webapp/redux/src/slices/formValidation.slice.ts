import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type FormValidations = {
  formValidations: {
    [key: string]: {
      // formName
      [key: string]: string; // fieldName
    };
  };
};

const initialState: FormValidations = {
  formValidations: {},
};

const formValidationSlice = createSlice({
  name: "formValidation",
  initialState,
  reducers: {
    setFieldError: (
      state,
      action: PayloadAction<{ formName: string; name: string; error: string }>
    ) => {
      if (!state.formValidations[action.payload.formName]) {
        state.formValidations[action.payload.formName] = {};
      }
      state.formValidations[action.payload.formName][action.payload.name] =
        action.payload.error;
    },
    clearFieldError: (
      state,
      action: PayloadAction<{ formName: string; name: string }>
    ) => {
      delete state.formValidations[action.payload.formName]?.[
        action.payload.name
      ];
    },
    clearFormErrors: (state, action: PayloadAction<{ formName: string }>) => {
      delete state.formValidations[action.payload.formName];
    },
  },
});

export const { setFieldError, clearFieldError, clearFormErrors } =
  formValidationSlice.actions;

export default formValidationSlice.reducer;
