import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type ReimbursementAttachmentsDTO,
  type ReimbursementDetailsDTO,
} from "~/types/reimbursement.types";

interface ReimburseFormState {
  activeStep: number;
  reimbursementDetails: ReimbursementDetailsDTO | null;
  reimbursementAttachments: ReimbursementAttachmentsDTO | [];
  cancelDialogIsOpen: boolean;
  formDialogIsOpen: boolean;
}

const initialState: ReimburseFormState = {
  activeStep: 0,
  reimbursementDetails: null,
  reimbursementAttachments: [],
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
      action: PayloadAction<ReimbursementDetailsDTO | null>,
    ) {
      state.reimbursementDetails = action.payload;
    },
    setReimbursementAttachments(
      state,
      action: PayloadAction<ReimbursementAttachmentsDTO | []>,
    ) {
      state.reimbursementAttachments = action.payload;
    },
    clearReimbursementForm(state) {
      state.activeStep = 0;
      state.reimbursementDetails = null;
      state.reimbursementAttachments = [];
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
