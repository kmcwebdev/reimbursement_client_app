import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type ReimbursementFormValues } from "~/types/reimbursement-form-values.type";

interface ReimburseFormState {
  activeStep: number;
  particularDetailsFormIsVisible: boolean;
  activeParticularIndex: string | null;
  selectedAttachmentMethod: "capture" | "upload" | null;
  reimbursementFormValues: ReimbursementFormValues;
  cancelDialogIsOpen: boolean;
  formDialogIsOpen: boolean;
}

const initialState: ReimburseFormState = {
  activeStep: 0,
  particularDetailsFormIsVisible: false,
  activeParticularIndex: null,
  selectedAttachmentMethod: null,
  reimbursementFormValues: {
    request_type: null,
    particulars: [],
    attachments: [],
    manager_approver_email: null,
  },
  formDialogIsOpen: false,
  cancelDialogIsOpen: false,
};

const reimbursementFormSlice = createSlice({
  name: "reimburse-form",
  initialState,
  reducers: {
    setActiveStep(state, action: PayloadAction<number>) {
      state.activeStep = action.payload;
    },
    setParticularDetailsFormIsVisible(state, action: PayloadAction<boolean>) {
      state.particularDetailsFormIsVisible = action.payload;
    },
    setActiveParticularIndex(state, action: PayloadAction<string | null>) {
      state.activeParticularIndex = action.payload;
    },
    setSelectedAttachmentMethod(
      state,
      action: PayloadAction<"capture" | "upload" | null>,
    ) {
      state.selectedAttachmentMethod = action.payload;
    },
    setReimbursementFormValues(
      state,
      action: PayloadAction<ReimbursementFormValues>,
    ) {
      state.reimbursementFormValues = action.payload;
    },
    clearReimbursementForm(state) {
      state.reimbursementFormValues = initialState.reimbursementFormValues;
      state.activeStep = 0;
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
  setParticularDetailsFormIsVisible,
  setActiveParticularIndex,
  setSelectedAttachmentMethod,
  setReimbursementFormValues,
  clearReimbursementForm,
  toggleFormDialog,
  toggleCancelDialog,
} = reimbursementFormSlice.actions;

export default reimbursementFormSlice.reducer;
