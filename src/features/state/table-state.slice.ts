import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type IReimbursementsFilterQuery } from "~/types/reimbursement.types";
import { removeUndefinedValues } from "~/utils/remove-undefined-values";

interface TableState {
  selectedItems: number[];
  filters: IReimbursementsFilterQuery;
  focusedReimbursementId: number | null;
  drawerIsOpen: boolean;
  bulkApprovalDialogIsOpen: boolean;
  singleApprovalDialogIsOpen: boolean;
  bulkCreditDialogIsOpen: boolean;
  singleCreditDialogIsOpen: boolean;
  bulkDownloadReportDialogIsOpen: boolean;
  singleDownloadReportDialogIsOpen: boolean;
  rejectDialogIsOpen: boolean;
  cancelDialogIsOpen: boolean;
  holdDialogIsOpen: boolean;
  currentSelectedFinanceTabValue: number;
}

const initialState: TableState = {
  selectedItems: [],
  filters: {},
  focusedReimbursementId: null,
  drawerIsOpen: false,
  bulkApprovalDialogIsOpen: false,
  singleApprovalDialogIsOpen: false,
  bulkCreditDialogIsOpen: false,
  singleCreditDialogIsOpen: false,
  bulkDownloadReportDialogIsOpen: false,
  singleDownloadReportDialogIsOpen: false,
  rejectDialogIsOpen: false,
  cancelDialogIsOpen: false,
  holdDialogIsOpen: false,
  currentSelectedFinanceTabValue: 1,
};

const TableStateSlice = createSlice({
  name: "tableStateSlice",
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
    setFocusedReimbursementId(state, action: PayloadAction<number | null>) {
      state.focusedReimbursementId = action.payload;
    },
    closeSideDrawer(state) {
      state.drawerIsOpen = false;
    },
    openSideDrawer(state) {
      state.drawerIsOpen = true;
    },
    resetPageTableState(state) {
      state.selectedItems = initialState.selectedItems;
      state.filters = initialState.filters;
    },
    toggleBulkApprovalDialog(state) {
      state.bulkApprovalDialogIsOpen = !state.bulkApprovalDialogIsOpen;
    },
    toggleSingleApprovalDialog(state) {
      state.singleApprovalDialogIsOpen = !state.singleApprovalDialogIsOpen;
    },
    toggleBulkCreditDialog(state) {
      state.bulkCreditDialogIsOpen = !state.bulkCreditDialogIsOpen;
    },
    toggleSingleCreditDialog(state) {
      state.singleCreditDialogIsOpen = !state.singleCreditDialogIsOpen;
    },
    toggleBulkDownloadReportDialog(state) {
      state.bulkDownloadReportDialogIsOpen =
        !state.bulkDownloadReportDialogIsOpen;
    },
    toggleSingleDownloadReportDialog(state) {
      state.singleDownloadReportDialogIsOpen =
        !state.singleDownloadReportDialogIsOpen;
    },
    toggleRejectDialog(state) {
      state.rejectDialogIsOpen = !state.rejectDialogIsOpen;
    },
    toggleCancelDialog(state) {
      state.cancelDialogIsOpen = !state.cancelDialogIsOpen;
    },
    toggleHoldDialog(state) {
      state.holdDialogIsOpen = !state.holdDialogIsOpen;
    },
    setCurrentSelectedFinanceTabValue(state, action: PayloadAction<number>) {
      state.currentSelectedFinanceTabValue = action.payload;
    },
  },
});

export const {
  setSelectedItems,
  setPageTableFilters,
  setFocusedReimbursementId,
  closeSideDrawer,
  openSideDrawer,
  resetPageTableState,
  toggleBulkApprovalDialog,
  toggleSingleApprovalDialog,
  toggleBulkCreditDialog,
  toggleSingleCreditDialog,
  toggleBulkDownloadReportDialog,
  toggleSingleDownloadReportDialog,
  toggleRejectDialog,
  toggleCancelDialog,
  toggleHoldDialog,
  setCurrentSelectedFinanceTabValue,
} = TableStateSlice.actions;

export default TableStateSlice.reducer;
