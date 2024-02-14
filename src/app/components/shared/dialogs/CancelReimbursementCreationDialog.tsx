import React from "react";
import { useAppSelector } from "~/app/hook";
import { Button } from "../../core/Button";
import Dialog from "../../core/Dialog";

interface CancelReimbursmentDialogProps {
  onAbort: () => void;
  onConfirm: () => void;
}

const CancelReimbursementCreationDialog: React.FC<
  CancelReimbursmentDialogProps
> = ({ onAbort, onConfirm }) => {
  const { cancelDialogIsOpen } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  return (
    <Dialog
      title="Cancel Reimbursements?"
      isVisible={cancelDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <div className="flex flex-col gap-8 pt-8">
        <p className="text-neutral-800">
          Are you sure you want to cancel reimbursement request?
        </p>

        <div className="flex items-center gap-4">
          <Button
            aria-label="No"
            variant="neutral"
            buttonType="outlined"
            className="w-1/2"
            onClick={onAbort}
          >
            No
          </Button>
          <Button
            aria-label="Yes,Cancel"
            variant="danger"
            className="w-1/2"
            onClick={onConfirm}
          >
            Yes, Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CancelReimbursementCreationDialog;
