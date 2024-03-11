import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type QueryFilter } from "~/types/reimbursement.types";
import { removeUndefinedValues } from "~/utils/remove-undefined-values";

interface FinanceDashboardState {
  filters: QueryFilter | null;
  selectedItems: number[];
}

const initialState: FinanceDashboardState = {
  filters: {
    request_status__id: "1",
  },
  selectedItems: [],
};

const financeDashboardStateSlice = createSlice({
  name: "finance-dashboard-state",
  initialState,
  reducers: {
    setFinanceDashboardFilters(
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
    setFinanceDashboardSelectedItems(state, action: PayloadAction<number[]>) {
      state.selectedItems = action.payload;
    },
  },
});

export const { setFinanceDashboardFilters, setFinanceDashboardSelectedItems } =
  financeDashboardStateSlice.actions;

export default financeDashboardStateSlice.reducer;
