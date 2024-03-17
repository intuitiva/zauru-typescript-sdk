import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    purchaseOrderIdNumber: { data: "", loading: false },
    dischargeIdNumber: { data: "NCB00000", loading: false },
};
const automaticNumbersSlice = createSlice({
    name: "automaticNumbers",
    initialState,
    reducers: {
        automaticNumberFetchStart: (state, action) => {
            state[action.payload].loading = true;
        },
        automaticNumberFetchSuccess: (state, action) => {
            state[action.payload.name].data = action.payload.data;
            state[action.payload.name].loading = false;
        },
    },
});
export const { automaticNumberFetchStart, automaticNumberFetchSuccess } = automaticNumbersSlice.actions;
export default automaticNumbersSlice.reducer;
