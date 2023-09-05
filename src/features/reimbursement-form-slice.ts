import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ReimbursementDetailsType } from "~/schema/reimbursement-details.schema";
import { type UploadFileResponse } from "~/types/file-upload-response.type";

interface ReimburseFormState {
  activeStep: number;
  reimbursementDetails: ReimbursementDetailsType | null;
  reimbursementAttachment: UploadFileResponse | null;
  cancelDialogIsOpen: boolean;
  formDialogIsOpen: boolean;
}

const initialState: ReimburseFormState = {
  activeStep: 0,
  reimbursementDetails: null,
  reimbursementAttachment: null,
  formDialogIsOpen: false,
  cancelDialogIsOpen: false,
};

const reimbursementFormSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveStep(state, action: PayloadAction<number>) {
      state.activeStep = action.payload;
    },
    setReimbursementDetails(
      state,
      action: PayloadAction<ReimbursementDetailsType | null>,
    ) {
      state.reimbursementDetails = action.payload;
    },
    setReimbursementAttachments(
      state,
      action: PayloadAction<UploadFileResponse | null>,
    ) {
      state.reimbursementAttachment = action.payload;
    },
    clearReimbursementForm(state) {
      state.activeStep = 0;
      state.reimbursementDetails = null;
      state.reimbursementAttachment = null;
    },
    toggleFormDialog(state) {
      state.formDialogIsOpen = !state.formDialogIsOpen;
    },
    toggleCancelDialog(state) {
      state.cancelDialogIsOpen = !state.cancelDialogIsOpen;
    },
  },
});

export const {
  setActiveStep,
  setReimbursementDetails,
  setReimbursementAttachments,
  clearReimbursementForm,
  toggleFormDialog,
  toggleCancelDialog,
} = reimbursementFormSlice.actions;

export default reimbursementFormSlice.reducer;
