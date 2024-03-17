import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    specialItems: [],
    loadingSpecialItems: false,
};
const webappTablesSlice = createSlice({
    name: "webappTables",
    initialState,
    reducers: {
        setLoadingSpecialItems: (state, action) => {
            state.loadingSpecialItems = action.payload;
        },
        setSpecialItems: (state, action) => {
            state.specialItems = action.payload;
            state.loadingSpecialItems = false;
        },
    },
});
export const { setLoadingSpecialItems, setSpecialItems } = webappTablesSlice.actions;
export default webappTablesSlice.reducer;
