import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IReimbursementsFilterQuery } from "~/types/reimbursement.types";

interface ApprovalPageState {
  selectedItems: string[];
  filters: IReimbursementsFilterQuery;
}

const initialState: ApprovalPageState = {
  selectedItems: [],
  filters: {},
};

const approvalPageStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedItems(state,action: PayloadAction<string[]>) {
      state.selectedItems = action.payload;
    },
    setApprovalTableFilters(state,action: PayloadAction<IReimbursementsFilterQuery>) {
      state.filters = action.payload;
    },
  },
});

export const {
  setSelectedItems,
  setApprovalTableFilters
} = approvalPageStateSlice.actions;

export default approvalPageStateSlice.reducer;
