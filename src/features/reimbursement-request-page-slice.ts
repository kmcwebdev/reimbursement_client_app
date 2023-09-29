import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IReimbursementsFilterQuery } from "~/types/reimbursement.types";

interface ReimbursementRequestPageState {
  selectedItems: string[];
  filters: IReimbursementsFilterQuery;
}

const initialState: ReimbursementRequestPageState = {
  selectedItems: [],
  filters: {},
};

const reimbursementPageStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedItems(state,action: PayloadAction<string[]>) {
      state.selectedItems = action.payload;
    },
    setReimbursementsTableFilters(state,action: PayloadAction<IReimbursementsFilterQuery>) {
      state.filters = action.payload;
    },
  },
});

export const {
  setSelectedItems,
  setReimbursementsTableFilters
} = reimbursementPageStateSlice.actions;

export default reimbursementPageStateSlice.reducer;
