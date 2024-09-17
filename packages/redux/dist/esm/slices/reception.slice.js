"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.receptionConcatToArray = exports.receptionFetchSuccess = exports.receptionFetchStart = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
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
    queueReceptions: {
        data: [],
        loading: false,
        reFetch: false,
    },
    offlineQueueReceptions: {
        data: [],
        loading: false,
        reFetch: false,
    },
};
const receptionSlice = (0, toolkit_1.createSlice)({
    name: "reception",
    initialState,
    reducers: {
        receptionFetchStart: (state, action) => {
            state[action.payload].loading = true;
        },
        receptionFetchSuccess: (state, action) => {
            if (state[action.payload.name].data) {
                state[action.payload.name].data = action.payload.data;
            }
            else {
                console.error("receptionFetchSuccess not found: ", action.payload.name);
            }
            state[action.payload.name].loading = false;
        },
        receptionConcatToArray: (state, action) => {
            if (state[action.payload.name].data) {
                if (Array.isArray(state[action.payload.name].data)) {
                    state[action.payload.name].data = [
                        ...state[action.payload.name].data,
                        action.payload.data,
                    ];
                }
            }
            else {
                console.error("receptionConcatToArray not found: ", action.payload.name);
            }
            state[action.payload.name].loading = false;
        },
    },
});
_a = receptionSlice.actions, exports.receptionFetchStart = _a.receptionFetchStart, exports.receptionFetchSuccess = _a.receptionFetchSuccess, exports.receptionConcatToArray = _a.receptionConcatToArray;
exports.default = receptionSlice.reducer;
