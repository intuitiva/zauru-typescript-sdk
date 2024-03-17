import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  ItemAssociatedLots,
  NewPurchaseOrderResponse,
  PurchaseOrderGeneralInfo,
  PurchaseOrderGraphQL,
  RejectionWebAppTableObject,
  WebAppRowGraphQL,
  QueueFormReceptionWebAppTable,
} from "@zauru-sdk/types";

export type RECEPTION_NAMES =
  | "basketLots"
  | "rejectionInfo"
  | "newPurchaseOrderInfo"
  | "purchaseOrderGeneralInfo"
  | "poReceptions"
  | "queueNewReceptions";

export interface ReceptionState {
  basketLots: { loading: boolean; data: ItemAssociatedLots; reFetch: boolean };
  rejectionInfo: {
    loading: boolean;
    data: RejectionWebAppTableObject;
    reFetch: boolean;
  };
  newPurchaseOrderInfo: {
    loading: boolean;
    data: NewPurchaseOrderResponse;
    reFetch: boolean;
  };
  purchaseOrderGeneralInfo: {
    loading: boolean;
    data: PurchaseOrderGeneralInfo;
    reFetch: boolean;
  };
  poReceptions: {
    loading: boolean;
    data: PurchaseOrderGraphQL[];
    reFetch: boolean;
  };
  queueNewReceptions: {
    loading: boolean;
    data: WebAppRowGraphQL<QueueFormReceptionWebAppTable>[];
    reFetch: boolean;
  };
}

const initialState: ReceptionState = {
  basketLots: {
    data: {} as ItemAssociatedLots,
    loading: false,
    reFetch: false,
  },
  rejectionInfo: {
    data: {} as RejectionWebAppTableObject,
    loading: false,
    reFetch: false,
  },
  newPurchaseOrderInfo: {
    data: {} as NewPurchaseOrderResponse,
    loading: false,
    reFetch: false,
  },
  purchaseOrderGeneralInfo: {
    data: {} as PurchaseOrderGeneralInfo,
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
    receptionFetchStart: (state, action: PayloadAction<RECEPTION_NAMES>) => {
      state[action.payload].loading = true;
    },
    receptionFetchSuccess: (
      state,
      action: PayloadAction<{ name: RECEPTION_NAMES; data: any }>
    ) => {
      state[action.payload.name].data = action.payload.data;
      state[action.payload.name].loading = false;
    },
    receptionConcatToArray: (
      state,
      action: PayloadAction<{ name: RECEPTION_NAMES; data: any }>
    ) => {
      if (Array.isArray(state[action.payload.name].data)) {
        state[action.payload.name].data = [
          ...(state[action.payload.name].data as any),
          action.payload.data,
        ];
      }
      state[action.payload.name].loading = false;
    },
  },
});

export const {
  receptionFetchStart,
  receptionFetchSuccess,
  receptionConcatToArray,
} = receptionSlice.actions;

export default receptionSlice.reducer;
