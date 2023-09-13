import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ColumnFiltersState } from "@tanstack/react-table";

interface ApprovalPageState {
  selectedItems: string[];
  columnFilters: ColumnFiltersState;
}

const initialState: ApprovalPageState = {
  selectedItems: [],
  columnFilters: [],
};

const approvalPageStateSlice = createSlice({
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
} = approvalPageStateSlice.actions;

export default approvalPageStateSlice.reducer;
