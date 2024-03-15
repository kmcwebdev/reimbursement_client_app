import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AttachedFile } from "~/app/components/shared/reimburse-form/steps/AddAttachments";
import { type ReimbursementFormValues } from "~/types/reimbursement.types";

interface ReimburseFormState {
  activeStep: number;
  particularDetailsFormIsVisible: boolean;
  activeParticularIndex: string | null;
  reimbursementFormValues: ReimbursementFormValues;
  _temp_attachedFiles: AttachedFile[];
  cancelDialogIsOpen: boolean;
  formDialogIsOpen: boolean;
}

const initialState: ReimburseFormState = {
  activeStep: 0,
  particularDetailsFormIsVisible: false,
  activeParticularIndex: null,
  reimbursementFormValues: {
    request_type: null,
    particulars: [],
    attachments: [],
    manager_approver_email: null,
  },
  _temp_attachedFiles: [],
  formDialogIsOpen: false,
  cancelDialogIsOpen: false,
};

const reimbursementFormSlice = createSlice({
  name: "reimburseFormSlice",
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
    _setTempAttachedFiles(state, action: PayloadAction<AttachedFile[]>) {
      state._temp_attachedFiles = action.payload;
    },
  },
});

export const {
  setActiveStep,
  setParticularDetailsFormIsVisible,
  setActiveParticularIndex,
  setReimbursementFormValues,
  clearReimbursementForm,
  toggleFormDialog,
  toggleCancelDialog,
  _setTempAttachedFiles,
} = reimbursementFormSlice.actions;

export default reimbursementFormSlice.reducer;
