import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    formValidations: {},
};
const formValidationsSlice = createSlice({
    name: "formValidations",
    initialState,
    reducers: {
        setFieldError: (state, action) => {
            state.formValidations[action.payload.formName][action.payload.name] =
                action.payload.error;
        },
    },
});
export const { setFieldError } = formValidationsSlice.actions;
export default formValidationsSlice.reducer;
