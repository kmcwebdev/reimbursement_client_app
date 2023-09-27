import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IReimbursementsFilterQuery } from "~/types/reimbursement.types";

interface HistoryRequestPageState {
  selectedItems: string[];
  filters: IReimbursementsFilterQuery;
}

const initialState: HistoryRequestPageState = {
  selectedItems: [],
  filters: {},
};

const historyPageStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedItems(state,action: PayloadAction<string[]>) {
      state.selectedItems = action.payload;
    },
    setHistoryTableFilters(state,action: PayloadAction<IReimbursementsFilterQuery>) {
      state.filters = action.payload;
    },
  },
});

export const {
  setSelectedItems,
  setHistoryTableFilters
} = historyPageStateSlice.actions;

export default historyPageStateSlice.reducer;
