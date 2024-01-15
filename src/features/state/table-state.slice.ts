import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IReimbursementsFilterQuery } from "~/types/reimbursement.types";
import { removeUndefinedValues } from "~/utils/remove-undefined-values";

interface TableState {
  selectedItems: number[];
  filters: IReimbursementsFilterQuery;
}

const initialState: TableState = {
  selectedItems: [],
  filters: {},
};

const TableStateSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedItems(state, action: PayloadAction<number[]>) {
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
  TableStateSlice.actions;

export default TableStateSlice.reducer;
