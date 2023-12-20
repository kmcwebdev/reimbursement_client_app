import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type FileWithPath } from "react-dropzone";
import { type UploadFileResponse } from "~/types/file-upload-response.type";
import { type ReimbursementFormValues } from "~/types/reimbursement-form-values.type";

interface ReimburseFormState {
  activeStep: number;
  isParticularFormActive: boolean;
  selectedParticularIndex: number | null;
  selectedAttachmentMethod: "capture" | "upload" | null;
  reimbursementFormValues: ReimbursementFormValues;
  reimbursementAttachment: UploadFileResponse | null;
  cancelDialogIsOpen: boolean;
  formDialogIsOpen: boolean;
  fileUploadedUrl: string | null;
  fileSelected: FileWithPath | null;
}

const initialState: ReimburseFormState = {
  activeStep: 0,
  isParticularFormActive: false,
  selectedParticularIndex: null,
  selectedAttachmentMethod: null,
  reimbursementFormValues: {
    reimbursement_request_type_id: null,
    particulars: null,
    attachments: [],
  },
  reimbursementAttachment: null,
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
    setIsParticularFormActive(state, action: PayloadAction<boolean>) {
      state.isParticularFormActive = action.payload;
    },
    setSelectedParticularIndex(state, action: PayloadAction<number | null>) {
      state.selectedParticularIndex = action.payload;
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
    setReimbursementAttachments(
      state,
      action: PayloadAction<UploadFileResponse | null>,
    ) {
      state.reimbursementAttachment = action.payload;
    },
    clearReimbursementForm(state) {
      state.reimbursementFormValues = initialState.reimbursementFormValues;
      state.activeStep = 0;
      state.reimbursementAttachment = null;
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
  setIsParticularFormActive,
  setSelectedAttachmentMethod,
  setSelectedParticularIndex,
  setReimbursementFormValues,
  setReimbursementAttachments,
  clearReimbursementForm,
  toggleFormDialog,
  toggleCancelDialog,
  setFileSelected,
  setUploadedFileUrl,
} = reimbursementFormSlice.actions;

export default reimbursementFormSlice.reducer;
