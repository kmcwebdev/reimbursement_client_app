import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { useAppSelector } from "~/app/hook";
import { type ReimbursementFormType } from "~/types/reimbursement.types";
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
  const { formDialogIsOpen, activeStep, particularDetailsFormIsVisible } =
    useAppSelector((state) => state.reimbursementForm);

  return (
    <Dialog
      title={classNames(
        activeStep == 0 && "Reimbursement Type",
        activeStep === 1 && !particularDetailsFormIsVisible && "Add Receipts",
        activeStep === 1 && particularDetailsFormIsVisible && "Receipt",
        activeStep === 2 && "Upload Receipt",
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
