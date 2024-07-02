import React from "react";
import ReimbursementActionApiService from "~/app/api/services/reimbursement-action-service";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import {
  closeSideDrawer,
  setFocusedReimbursementId,
  toggleCancelDialog,
} from "~/features/state/table-state.slice";
import { Button } from "../../core/Button";
import Dialog from "../../core/Dialog";
import { showToast } from "../../core/Toast";

const CancelReimbursementDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cancelDialogIsOpen, focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );
  const onAbort = () => {
    dispatch(toggleCancelDialog());
  };

  const { mutateAsync: cancelReimbursement, isLoading: isCancelling } =
    ReimbursementActionApiService.useCancelReimbursement({
      onSuccess: () => {
        showToast({
          type: "success",
          description: "Reimbursement Request successfully cancelled!",
        });
        onAbort();
        dispatch(closeSideDrawer());
        dispatch(setFocusedReimbursementId(null));
      },
      onError: (error) => {
        showToast({
          type: "error",
          description: error.data.detail,
        });
      },
    });

  const handleConfirmCancellation = () => {
    if (focusedReimbursementId) {
      void cancelReimbursement({
        id: focusedReimbursementId,
      });
    }
  };

  return (
    <Dialog
      title="Cancel Reimbursements?"
      isVisible={cancelDialogIsOpen}
      close={onAbort}
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
            disabled={isCancelling}
          >
            No
          </Button>
          <Button
            aria-label="Yes"
            variant="danger"
            className="w-1/2"
            onClick={handleConfirmCancellation}
            disabled={isCancelling}
            loading={isCancelling}
          >
            Yes
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CancelReimbursementDialog;
