import { configureStore } from "@reduxjs/toolkit";
import layoutStateSlice from "~/features/state/layout-state-slice";
import reimbursementFormSlice from "~/features/state/reimbursement-form-slice";
import pageTableStateSlice from "~/features/state/table-state.slice";
import { env } from "../../env.mjs";
import userReducer from "../features/state/user-state.slice";
import { appApiSlice } from "./rtkQuery";

const store = configureStore({
  reducer: {
    [appApiSlice.reducerPath]: appApiSlice.reducer,
    session: userReducer,
    reimbursementForm: reimbursementFormSlice,
    layoutState: layoutStateSlice,
    pageTableState: pageTableStateSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(appApiSlice.middleware),
  devTools: env.NEXT_PUBLIC_ENVIRONMENT === "development",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
