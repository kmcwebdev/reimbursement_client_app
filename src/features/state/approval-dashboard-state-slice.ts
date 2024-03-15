import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type QueryFilter } from "~/types/reimbursement.types";
import { removeUndefinedValues } from "~/utils/remove-undefined-values";

interface ApprovalDashboardState {
  filters: QueryFilter | null;
  selectedItems: number[];
}

const initialState: ApprovalDashboardState = {
  filters: null,
  selectedItems: [],
};

const approvalDashboardStateSlice = createSlice({
  name: "approval-dashboard-state",
  initialState,
  reducers: {
    setApprovalDashboardFilters(
      state,
      action: PayloadAction<QueryFilter | null>,
    ) {
      const payload = action.payload;
      if (payload !== null) {
        state.filters = removeUndefinedValues(payload) as QueryFilter;
      } else {
        state.filters = payload;
      }
    },
    setApprovalDashboardSelectedItems(state, action: PayloadAction<number[]>) {
      state.selectedItems = action.payload;
    },
  },
});

export const {
  setApprovalDashboardFilters,
  setApprovalDashboardSelectedItems,
} = approvalDashboardStateSlice.actions;

export default approvalDashboardStateSlice.reducer;
