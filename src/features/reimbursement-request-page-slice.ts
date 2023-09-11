import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ColumnFiltersState } from "@tanstack/react-table";

interface ReimbursementRequestPageState {
  selectedItems: string[];
  columnFilters: ColumnFiltersState;
}

const initialState: ReimbursementRequestPageState = {
  selectedItems: [],
  columnFilters: [],
};

const reimbursementPageStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedItems(state,action: PayloadAction<string[]>) {
      state.selectedItems = action.payload;
    },
    setColumnFilters(state,action: PayloadAction<ColumnFiltersState>) {
      state.columnFilters = action.payload;
    },
  },
});

export const {
  setSelectedItems,
  setColumnFilters
} = reimbursementPageStateSlice.actions;

export default reimbursementPageStateSlice.reducer;
