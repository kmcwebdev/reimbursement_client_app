import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IReimbursementsFilterQuery } from "~/types/reimbursement.types";
import { removeUndefinedValues } from "~/utils/remove-undefined-values";

interface PageTableState {
  selectedItems: string[];
  filters: IReimbursementsFilterQuery;
}

const initialState: PageTableState = {
  selectedItems: [],
  filters: {},
};

const pageTableStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedItems(state, action: PayloadAction<string[]>) {
      state.selectedItems = action.payload;
    },
    setPageTableFilters(
      state,
      action: PayloadAction<IReimbursementsFilterQuery>,
    ) {
      state.filters = removeUndefinedValues(
        action.payload,
      ) as IReimbursementsFilterQuery;
    },
    resetPageTableState(state) {
      state.selectedItems = [];
      state.filters = {};
    },
  },
});

export const { setSelectedItems, setPageTableFilters, resetPageTableState } =
  pageTableStateSlice.actions;

export default pageTableStateSlice.reducer;
