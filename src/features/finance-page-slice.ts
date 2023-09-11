import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ColumnFiltersState } from "@tanstack/react-table";

interface FinancePageState {
  selectedItems: string[];
  columnFilters: ColumnFiltersState;
  isFilterButtonsHidden: boolean;
}

const initialState: FinancePageState = {
  selectedItems: [],
  columnFilters: [],
  isFilterButtonsHidden:false,
};

const financePageStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedItems(state,action: PayloadAction<string[]>) {
      state.selectedItems = action.payload;
    },
    setColumnFilters(state,action: PayloadAction<ColumnFiltersState>) {
      state.columnFilters = action.payload;
    },
    setFilterButtonsHidden(state,action: PayloadAction<boolean>) {
      state.isFilterButtonsHidden = action.payload;
    },
  },
});

export const {
  setSelectedItems,
  setColumnFilters,
  setFilterButtonsHidden,
} = financePageStateSlice.actions;

export default financePageStateSlice.reducer;
