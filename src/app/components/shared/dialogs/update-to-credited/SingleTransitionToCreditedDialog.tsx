import React from "react";
import ReimbursementActionApiService from "~/app/api/services/reimbursement-action-service";
import { Button } from "~/app/components/core/Button";
import Dialog from "~/app/components/core/Dialog";
import { showToast } from "~/app/components/core/Toast";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import {
  closeSideDrawer,
  toggleSingleCreditDialog,
} from "~/features/state/table-state.slice";
import {
  type CreditPayload,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";

type SingleTransitionToCreditedDialogProps = {
  selectedReimbursement?: ReimbursementRequest;
};

const SingleTransitionToCreditedDialog: React.FC<
  SingleTransitionToCreditedDialogProps
> = ({ selectedReimbursement }) => {
  const { singleCreditDialogIsOpen } = useAppSelector(
    (state) => state.pageTableState,
  );
  const dispatch = useAppDispatch();

  const { mutateAsync: creditReimbursement, isLoading: isCrediting } =
    ReimbursementActionApiService.useMoveToCredited({
      onSuccess: () => {
        dispatch(
          appApiSlice.util.invalidateTags([
            "ReimbursementRequest",
            "ReimbursementApprovalList",
            "ReimbursementHistoryList",
            "ApprovalAnalytics",
          ]),
        );
        showToast({
          type: "success",
          description:
            "Reimbursement Requests status successfully changed to credited!",
        });
        onAbort();
        dispatch(closeSideDrawer());
      },
      onError: (error) => {
        showToast({
          type: "error",
          description: error.data.detail,
        });
      },
    });

  const onAbort = () => {
    dispatch(toggleSingleCreditDialog());
  };

  const handleConfirmCreditReimbursements = () => {
    if (selectedReimbursement) {
      const payload: CreditPayload = {
        request_ids: [selectedReimbursement.id.toString()],
        credit_all_request: false,
      };

      void creditReimbursement(payload);
    }
  };
  return (
    <Dialog
      title="Change Status to Credited?"
      isVisible={singleCreditDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <div className="flex flex-col gap-8 pt-8">
        {selectedReimbursement && (
          <p className="text-neutral-800">
            Are you sure you want{" "}
            <strong>
              {selectedReimbursement.reimb_requestor.first_name}{" "}
              {selectedReimbursement.reimb_requestor.last_name},{" "}
              {selectedReimbursement.reference_no}
            </strong>{" "}
            reimbursements status to be changed to credited?
          </p>
        )}

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
            aria-label="Yes,Update"
            loading={isCrediting}
            disabled={isCrediting}
            className="w-1/2"
            onClick={handleConfirmCreditReimbursements}
          >
            Yes, Update
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SingleTransitionToCreditedDialog;
