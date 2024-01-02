import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type FileWithPath } from "react-dropzone";
import { type ReimbursementFormValues } from "~/types/reimbursement-form-values.type";

type ParticularStepType =
  | "particular-list"
  | "details"
  | "method-selection"
  | "capture"
  | "upload";
interface ReimburseFormState {
  activeStep: number;
  activeParticularStep: ParticularStepType;
  activeParticularIndex: string | null;
  reimbursementFormValues: ReimbursementFormValues;
  cancelDialogIsOpen: boolean;
  formDialogIsOpen: boolean;
  fileUploadedUrl: string | null;
  fileSelected: FileWithPath | null;
}

const initialState: ReimburseFormState = {
  activeStep: 0,
  activeParticularStep: "details",
  activeParticularIndex: null,
  reimbursementFormValues: {
    reimbursement_request_type_id: null,
    particulars: [],
  },
  formDialogIsOpen: false,
  cancelDialogIsOpen: false,
  fileUploadedUrl: null,
  fileSelected: null,
};

const reimbursementFormSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveStep(state, action: PayloadAction<number>) {
      state.activeStep = action.payload;
    },
    setActiveParticularStep(state, action: PayloadAction<ParticularStepType>) {
      state.activeParticularStep = action.payload;
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
      state.fileSelected = null;
      state.fileUploadedUrl = null;
    },
    toggleFormDialog(state) {
      state.formDialogIsOpen = !state.formDialogIsOpen;
    },
    toggleCancelDialog(state) {
      state.cancelDialogIsOpen = !state.cancelDialogIsOpen;
    },
    setFileSelected(state, action: PayloadAction<FileWithPath | null>) {
      state.fileSelected = action.payload;
    },
    setUploadedFileUrl(state, action: PayloadAction<string | null>) {
      state.fileUploadedUrl = action.payload;
    },
  },
});

export const {
  setActiveStep,
  setActiveParticularStep,
  setActiveParticularIndex,
  setReimbursementFormValues,
  clearReimbursementForm,
  toggleFormDialog,
  toggleCancelDialog,
  setFileSelected,
  setUploadedFileUrl,
} = reimbursementFormSlice.actions;

export default reimbursementFormSlice.reducer;
