import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { useTransitionToCreditedMutation } from "~/features/api/actions-api-slice";
import {
  setSelectedItems,
  toggleBulkCreditDialog,
} from "~/features/state/table-state.slice";
import {
  type CreditPayload,
  type IReimbursementRequest,
} from "~/types/reimbursement.types";
import { Button } from "../../../core/Button";
import Dialog from "../../../core/Dialog";
import { showToast } from "../../../core/Toast";

type BulkTransitionToCreditedDialogProps = {
  selectedReimbursement?: IReimbursementRequest;
};

const BulkTransitionToCreditedDialog: React.FC<
  BulkTransitionToCreditedDialogProps
> = ({ selectedReimbursement }) => {
  const { selectedItems, bulkCreditDialogIsOpen } = useAppSelector(
    (state) => state.pageTableState,
  );
  const dispatch = useAppDispatch();

  const [creditReimbursement, { isLoading: isCrediting }] =
    useTransitionToCreditedMutation();

  const onAbort = () => {
    dispatch(toggleBulkCreditDialog());
  };

  const handleConfirmCreditReimbursements = () => {
    let payload: CreditPayload = {
      request_ids: [],
      credit_all_request: false,
    };

    if (selectedItems.length > 0) {
      payload = {
        request_ids: selectedItems.map(String),
        credit_all_request: false,
      };
    }

    if (selectedItems.length === 0) {
      payload = {
        request_ids: [],
        credit_all_request: true,
      };
    }

    void creditReimbursement(payload)
      .unwrap()
      .then(() => {
        showToast({
          type: "success",
          description:
            "Reimbursement Requests status successfully changed to credited!",
        });
        onAbort();
        dispatch(setSelectedItems([]));
        dispatch(
          appApiSlice.util.invalidateTags([
            "ReimbursementRequest",
            "ReimbursementApprovalList",
            "ApprovalAnalytics",
          ]),
        );
      })
      .catch(() => {
        showToast({
          type: "error",
          description: "Status update failed!",
        });
      });
  };
  return (
    <Dialog
      title="Change Status to Credited?"
      isVisible={bulkCreditDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <div className="flex flex-col gap-8 pt-8">
        {selectedItems.length === 0 && (
          <p className="text-neutral-800">
            Are you sure you want <strong>all</strong> reimbursements status to
            be changed to credited?
          </p>
        )}

        {selectedItems.length === 1 && selectedReimbursement && (
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

        {selectedItems.length > 1 && (
          <p className="text-neutral-800">
            Are you sure you want <strong>{selectedItems.length}</strong>{" "}
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

export default BulkTransitionToCreditedDialog;
