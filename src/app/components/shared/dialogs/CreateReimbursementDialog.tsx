import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import { type ReimbursementFormType } from "~/schema/reimbursement-type.schema";
import { classNames } from "~/utils/classNames";
import Dialog from "../../core/Dialog";
import ReimburseForm from "../reimburse-form";

interface CreateReimbursementDialogProps {
  onAbort: () => void;
  formReturn: UseFormReturn<ReimbursementFormType>;
}

const CreateReimbursementDialog: React.FC<CreateReimbursementDialogProps> = ({
  onAbort,
  formReturn,
}) => {
  const {
    formDialogIsOpen,
    activeStep,
    particularDetailsFormIsVisible,
    selectedAttachmentMethod,
  } = useAppSelector((state) => state.reimbursementForm);

  return (
    <Dialog
      title={classNames(
        activeStep == 0 && "Reimbursement Type",
        activeStep === 1 &&
          !particularDetailsFormIsVisible &&
          "Add Particulars",
        activeStep === 1 && particularDetailsFormIsVisible && "Particular",
        activeStep === 2 &&
          !selectedAttachmentMethod &&
          "Select Attachment Method",
        activeStep === 2 &&
          selectedAttachmentMethod === "capture" &&
          "Take Photo",
        activeStep === 2 &&
          selectedAttachmentMethod === "upload" &&
          "Upload Files",
        activeStep === 3 && "Set Approver",
      )}
      isVisible={formDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <ReimburseForm formReturn={formReturn} handleOpenCancelDialog={onAbort} />
    </Dialog>
  );
};

export default CreateReimbursementDialog;
