import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type QueryFilter } from "~/types/reimbursement.types";
import { removeUndefinedValues } from "~/utils/remove-undefined-values";

interface HistoryDashboardState {
  filters: QueryFilter | null;
  selectedItems: number[];
}

const initialState: HistoryDashboardState = {
  filters: null,
  selectedItems: [],
};

const historyDashboardStateSlice = createSlice({
  name: "history-dashboard-state",
  initialState,
  reducers: {
    setHistoryDashboardFilters(
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
    setHistoryDashboardSelectedItems(state, action: PayloadAction<number[]>) {
      state.selectedItems = action.payload;
    },
  },
});

export const { setHistoryDashboardFilters, setHistoryDashboardSelectedItems } =
  historyDashboardStateSlice.actions;

export default historyDashboardStateSlice.reducer;
