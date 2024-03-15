import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type QueryFilter } from "~/types/reimbursement.types";
import { removeUndefinedValues } from "~/utils/remove-undefined-values";

interface AdminDashboardState {
  filters: QueryFilter | null;
  selectedItems: number[];
}

const initialState: AdminDashboardState = {
  filters: null,
  selectedItems: [],
};

const adminDashboardStateSlice = createSlice({
  name: "admin-dashboard-state",
  initialState,
  reducers: {
    setAdminDashboardFilters(state, action: PayloadAction<QueryFilter | null>) {
      const payload = action.payload;
      if (payload !== null) {
        state.filters = removeUndefinedValues(payload) as QueryFilter;
      } else {
        state.filters = payload;
      }
    },
    setAdminDashboardSelectedItems(state, action: PayloadAction<number[]>) {
      state.selectedItems = action.payload;
    },
  },
});

export const { setAdminDashboardFilters, setAdminDashboardSelectedItems } =
  adminDashboardStateSlice.actions;

export default adminDashboardStateSlice.reducer;
