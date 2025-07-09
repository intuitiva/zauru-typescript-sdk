import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  ItemAssociatedLots,
  NewPurchaseOrderResponse,
  PurchaseOrderGeneralInfo,
  PurchaseOrderGraphQL,
  RejectionWebAppTableObject,
  ShipmentGraphQL,
  WebAppRowGraphQL,
} from "@zauru-sdk/types";

type ApiResponseFor4pinosReceptions = {
  apiCall: number;
  authorizedPO?: PurchaseOrderGraphQL;
  shipment?: ShipmentGraphQL;
  qcShipment?: ShipmentGraphQL;
};

type QueueFormReceptionWebAppTable = {
  creadoPor: string;
  fechaCreacion: string;
  formSubmited: any;
  estado: string;
  agency_id: number;
  apiResponses?: ApiResponseFor4pinosReceptions;
  description: string;
  timeStamp?: number;
  username?: string;
  token?: string;
};

export type RECEPTION_NAMES =
  | "basketLots"
  | "rejectionInfo"
  | "newPurchaseOrderInfo"
  | "purchaseOrderGeneralInfo"
  | "poReceptions"
  | "offlineQueueReceptions"
  | "queueReceptions";

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
  queueReceptions: {
    loading: boolean;
    data: WebAppRowGraphQL<QueueFormReceptionWebAppTable>[];
    reFetch: boolean;
  };
  offlineQueueReceptions: {
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
      if (state[action.payload.name].data) {
        state[action.payload.name].data = action.payload.data;
      } else {
        console.error("receptionFetchSuccess not found: ", action.payload.name);
      }
      state[action.payload.name].loading = false;
    },
    receptionConcatToArray: (
      state,
      action: PayloadAction<{ name: RECEPTION_NAMES; data: any }>
    ) => {
      if (state[action.payload.name].data) {
        if (Array.isArray(state[action.payload.name].data)) {
          state[action.payload.name].data = [
            ...(state[action.payload.name].data as any),
            action.payload.data,
          ];
        }
      } else {
        console.error(
          "receptionConcatToArray not found: ",
          action.payload.name
        );
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
