import React from "react";
import { Button } from "~/app/components/core/Button";
import Dialog from "~/app/components/core/Dialog";
import { showToast } from "~/app/components/core/Toast";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { useApproveReimbursementMutation } from "~/features/api/actions-api-slice";
import {
  setSelectedItems,
  toggleBulkApprovalDialog,
} from "~/features/state/table-state.slice";
import {
  type IReimbursementRequest,
  type IRequestListResponse,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";

type BulkApproveReimbursementsDialogProps = {
  data?: IRequestListResponse;
  selectedReimbursement?: IReimbursementRequest;
};

const BulkApproveReimbursementsDialog: React.FC<
  BulkApproveReimbursementsDialogProps
> = ({ data, selectedReimbursement }) => {
  const dispatch = useAppDispatch();
  const { selectedItems, bulkApprovalDialogIsOpen } = useAppSelector(
    (state) => state.pageTableState,
  );
  const onAbort = () => {
    dispatch(toggleBulkApprovalDialog());
  };

  const [approveReimbursement, { isLoading: isApproving }] =
    useApproveReimbursementMutation();

  const handleApprove = () => {
    const matrixIds: number[] = [];

    if (selectedItems.length > 0) {
      selectedItems.forEach((a) => {
        matrixIds.push(a);
      });
    } else {
      data?.results.forEach((request) => {
        matrixIds.push(request.id);
      });
    }

    let processedItems = selectedItems.length;

    matrixIds.forEach((a) => {
      void approveReimbursement({ id: a })
        .unwrap()
        .then(() => {
          dispatch(
            appApiSlice.util.invalidateTags([{ type: "ReimbursementRequest" }]),
          );

          processedItems = processedItems - 1;

          if (processedItems === 0) {
            dispatch(setSelectedItems([]));
            showToast({
              type: "success",
              description: "Reimbursement Requests successfully approved!",
            });
            onAbort();
          }
        })
        .catch(() => {
          showToast({
            type: "error",
            description: "Approval failed!",
          });
        });
    });
  };

  return (
    <Dialog
      title={
        selectedItems && selectedItems.length > 1
          ? "Approve Reimbursements?"
          : "Approve Reimbursement?"
      }
      isVisible={bulkApprovalDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <div className="flex flex-col gap-8 pt-8">
        <div className="text-neutral-800">
          {selectedItems.length === 0 && (
            <p className="text-neutral-800">
              Are you sure you want to approve <strong>all</strong>{" "}
              reimbursements?
            </p>
          )}
          {selectedItems &&
            selectedItems.length === 1 &&
            selectedReimbursement && (
              <>
                Are you sure you want to approve reimbursement request{" "}
                {selectedReimbursement.reference_no} with total amount of{" "}
                {currencyFormat(+selectedReimbursement.total_amount)}?
              </>
            )}

          {selectedItems && selectedItems.length > 1 && (
            <>
              Are you sure you want to approve{" "}
              <strong>{selectedItems.length}</strong> selected reimbursement
              request?
            </>
          )}
        </div>

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

export default BulkApproveReimbursementsDialog;
