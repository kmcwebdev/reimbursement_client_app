import { configureStore } from "@reduxjs/toolkit";
import adminDashboardStateSlice from "~/features/state/admin-dashboard-state-slice";
import approvalDashboardStateSlice from "~/features/state/approval-dashboard-state-slice";
import financeDashboardStateSlice from "~/features/state/finance-dashboard-state-slice";
import historyDashboardStateSlice from "~/features/state/history-dashboard-state-slice";
import layoutStateSlice from "~/features/state/layout-state-slice";
import reimbursementFormSlice from "~/features/state/reimbursement-form-slice";
import pageTableStateSlice from "~/features/state/table-state.slice";
import userDashboardStateSlice from "~/features/state/user-dashboard-state-slice";
import { env } from "../../env.mjs";
import userReducer from "../features/state/user-state.slice";
import { appApiSlice } from "./rtkQuery";

const store = () =>
  configureStore({
    reducer: {
      [appApiSlice.reducerPath]: appApiSlice.reducer,
      session: userReducer,
      reimbursementForm: reimbursementFormSlice,
      layoutState: layoutStateSlice,
      pageTableState: pageTableStateSlice,
      adminDashboardState: adminDashboardStateSlice,
      financeDashboardState: financeDashboardStateSlice,
      approvalDashboardState: approvalDashboardStateSlice,
      historyDashboardState: historyDashboardStateSlice,
      userDashboardState: userDashboardStateSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(appApiSlice.middleware),
    devTools: env.NEXT_PUBLIC_ENVIRONMENT === "development",
  });

export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

export default store;
