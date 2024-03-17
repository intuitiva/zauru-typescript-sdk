import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    receptionTemplate: { data: "", loading: false },
};
const templateSlice = createSlice({
    name: "template",
    initialState,
    reducers: {
        templateFetchStart: (state, action) => {
            state[action.payload].loading = true;
        },
        templateFetchSuccess: (state, action) => {
            state[action.payload.name].data = action.payload.data;
            state[action.payload.name].loading = false;
        },
    },
});
export const { templateFetchStart, templateFetchSuccess } = templateSlice.actions;
export default templateSlice.reducer;
