import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    basketLots: {
        data: {},
        loading: false,
        reFetch: false,
    },
    rejectionInfo: {
        data: {},
        loading: false,
        reFetch: false,
    },
    newPurchaseOrderInfo: {
        data: {},
        loading: false,
        reFetch: false,
    },
    purchaseOrderGeneralInfo: {
        data: {},
        loading: false,
        reFetch: false,
    },
    poReceptions: {
        data: [],
        loading: false,
        reFetch: false,
    },
    queueNewReceptions: {
        data: [],
        loading: false,
        reFetch: false,
    },
};
const receptionSlice = createSlice({
    name: "reception",
    initialState,
    reducers: {
        receptionFetchStart: (state, action) => {
            state[action.payload].loading = true;
        },
        receptionFetchSuccess: (state, action) => {
            state[action.payload.name].data = action.payload.data;
            state[action.payload.name].loading = false;
        },
        receptionConcatToArray: (state, action) => {
            if (Array.isArray(state[action.payload.name].data)) {
                state[action.payload.name].data = [
                    ...state[action.payload.name].data,
                    action.payload.data,
                ];
            }
            state[action.payload.name].loading = false;
        },
    },
});
export const { receptionFetchStart, receptionFetchSuccess, receptionConcatToArray, } = receptionSlice.actions;
export default receptionSlice.reducer;
