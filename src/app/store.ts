import { configureStore } from "@reduxjs/toolkit";
// import testReducer from "../features/test-slice";
import { env } from "~/env.mjs";
import layoutStateSlice from "~/features/layout-state-slice";
import pageTableStateSlice from "~/features/page-state.slice";
import reimbursementFormSlice from "~/features/reimbursement-form-slice";
import userReducer from "../features/user-slice";
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
      serializableCheck: false
    }
    ).concat(appApiSlice.middleware),
  devTools: env.NEXT_PUBLIC_ENVIRONMENT === "development",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
