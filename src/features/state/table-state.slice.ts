import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TableState {
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
}

const initialState: TableState = {
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
};

const TableStateSlice = createSlice({
  name: "tableStateSlice",
  initialState,
  reducers: {
    setFocusedReimbursementId(state, action: PayloadAction<number | null>) {
      state.focusedReimbursementId = action.payload;
    },
    closeSideDrawer(state) {
      state.drawerIsOpen = false;
    },
    openSideDrawer(state) {
      state.drawerIsOpen = true;
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
  },
});

export const {
  setFocusedReimbursementId,
  closeSideDrawer,
  openSideDrawer,
  toggleBulkApprovalDialog,
  toggleSingleApprovalDialog,
  toggleBulkCreditDialog,
  toggleSingleCreditDialog,
  toggleBulkDownloadReportDialog,
  toggleSingleDownloadReportDialog,
  toggleRejectDialog,
  toggleCancelDialog,
  toggleHoldDialog,
} = TableStateSlice.actions;

export default TableStateSlice.reducer;
