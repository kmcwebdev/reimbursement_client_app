import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type QueryFilter } from "~/types/reimbursement.types";
import { removeUndefinedValues } from "~/utils/remove-undefined-values";

interface UserDashboardState {
  filters: QueryFilter | null;
}

const initialState: UserDashboardState = {
  filters: null,
};

const userDashboardStateSlice = createSlice({
  name: "user-dashboard-state",
  initialState,
  reducers: {
    setUserDashboardFilters(state, action: PayloadAction<QueryFilter | null>) {
      const payload = action.payload;
      if (payload !== null) {
        state.filters = removeUndefinedValues(payload) as QueryFilter;
      } else {
        state.filters = payload;
      }
    },
  },
});

export const { setUserDashboardFilters } = userDashboardStateSlice.actions;

export default userDashboardStateSlice.reducer;
