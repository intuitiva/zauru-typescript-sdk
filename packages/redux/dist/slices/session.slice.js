import { createSlice } from "@reduxjs/toolkit";
const initialState = {};
const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setSessionValue: (state, action) => {
            state[action.payload.name] = action.payload.data;
        },
    },
});
export const { setSessionValue } = sessionSlice.actions;
export default sessionSlice.reducer;
