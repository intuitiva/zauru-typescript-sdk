import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    pageTable1: 1,
    pageTable2: 1,
    pageTable3: 1,
};
const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        tableSetPage: (state, action) => {
            state[action.payload.name] = action.payload.data;
        },
    },
});
export const { tableSetPage } = tableSlice.actions;
export default tableSlice.reducer;
