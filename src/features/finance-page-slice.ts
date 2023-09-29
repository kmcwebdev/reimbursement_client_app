import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IReimbursementsFilterQuery } from "~/types/reimbursement.types";

interface FinancePageState {
  selectedItems: string[];
  filters: IReimbursementsFilterQuery;
}

const initialState: FinancePageState = {
  selectedItems: [],
  filters: {},
};

const financePageStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedItems(state,action: PayloadAction<string[]>) {
      state.selectedItems = action.payload;
    },
    setFinanceTableFilters(state,action: PayloadAction<IReimbursementsFilterQuery>) {
      state.filters = action.payload;
    },
  },
});

export const {
  setSelectedItems,
  setFinanceTableFilters,
} = financePageStateSlice.actions;

export default financePageStateSlice.reducer;
