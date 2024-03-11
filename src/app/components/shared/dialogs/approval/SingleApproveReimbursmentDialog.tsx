import React from "react";
import { Button } from "~/app/components/core/Button";
import Dialog from "~/app/components/core/Dialog";
import { showToast } from "~/app/components/core/Toast";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { useApproveReimbursementMutation } from "~/features/api/actions-api-slice";
import {
  closeSideDrawer,
  setFocusedReimbursementId,
  toggleSingleApprovalDialog,
} from "~/features/state/table-state.slice";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";

type SingleApproveReimbursementsDialogProps = {
  selectedReimbursement?: ReimbursementRequest;
};

const SingleApproveReimbursementsDialog: React.FC<
  SingleApproveReimbursementsDialogProps
> = ({ selectedReimbursement }) => {
  const dispatch = useAppDispatch();
  const { singleApprovalDialogIsOpen, focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );
  const onAbort = () => {
    dispatch(toggleSingleApprovalDialog());
  };

  const [approveReimbursement, { isLoading: isApproving }] =
    useApproveReimbursementMutation();

  const handleApprove = () => {
    if (focusedReimbursementId) {
      const matrixIds: number[] = [];

      matrixIds.push(focusedReimbursementId);

      matrixIds.forEach((a) => {
        void approveReimbursement({ id: a })
          .unwrap()
          .then(() => {
            dispatch(
              appApiSlice.util.invalidateTags([
                "ReimbursementApprovalList",
                "ReimbursementRequest",
              ]),
            );

            showToast({
              type: "success",
              description: "Reimbursement Requests successfully approved!",
            });

            dispatch(setFocusedReimbursementId(null));
            dispatch(closeSideDrawer());

            onAbort();
          })
          .catch(() => {
            showToast({
              type: "error",
              description: "Approval failed!",
            });
          });
      });
    }
  };

  return (
    <Dialog
      title="Approve Reimbursement?"
      isVisible={singleApprovalDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <div className="flex flex-col gap-8 pt-8">
        <p className="text-neutral-800">
          {selectedReimbursement && (
            <>
              Are you sure you want to approve reimbursement request{" "}
              {selectedReimbursement.reference_no} with total amount of{" "}
              {currencyFormat(+selectedReimbursement.total_amount)}?
            </>
          )}
        </p>

        <div className="flex items-center gap-4">
          <Button
            aria-label="Cancel"
            variant="neutral"
            buttonType="outlined"
            className="w-1/2"
            onClick={onAbort}
            disabled={isApproving}
          >
            Cancel
          </Button>
          <Button
            aria-label="Approve"
            className="w-1/2"
            onClick={handleApprove}
            disabled={isApproving}
            loading={isApproving}
          >
            Approve
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SingleApproveReimbursementsDialog;
