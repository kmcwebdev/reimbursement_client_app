import React, { useState } from "react";
import ReimbursementActionApiService from "~/app/api/services/reimbursement-action-service";
import { Button } from "~/app/components/core/Button";
import Dialog from "~/app/components/core/Dialog";
import { showToast } from "~/app/components/core/Toast";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { toggleBulkApprovalDialog } from "~/features/state/table-state.slice";
import {
  type ReimbursementRequest,
  type RequestListResponse,
} from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";

type BulkApproveReimbursementsDialogProps = {
  data?: RequestListResponse;
  selectedReimbursement?: ReimbursementRequest;
  selectedItems: number[];
  setSelectedItems: (e: number[]) => void;
};

const BulkApproveReimbursementsDialog: React.FC<
  BulkApproveReimbursementsDialogProps
> = ({ data, selectedReimbursement, selectedItems, setSelectedItems }) => {
  const dispatch = useAppDispatch();
  const [processedItems, setProcessedItems] = useState<number>(0);
  const { bulkApprovalDialogIsOpen } = useAppSelector(
    (state) => state.pageTableState,
  );
  const onAbort = () => {
    dispatch(toggleBulkApprovalDialog());
  };

  const { mutateAsync: approveReimbursement, isLoading: isApproving } =
    ReimbursementActionApiService.useApproveReimbursement({
      onSuccess: () => {
        setProcessedItems(processedItems - 1);

        if (processedItems === 0) {
          setSelectedItems([]);
          dispatch(
            appApiSlice.util.invalidateTags([
              "ReimbursementRequest",
              "ReimbursementApprovalList",
            ]),
          );
          showToast({
            type: "success",
            description: "Reimbursement Requests successfully approved!",
          });
          onAbort();
        }
      },
      onError: (error) => {
        showToast({
          type: "error",
          description: error.data.detail,
        });
      },
    });

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

    setProcessedItems(matrixIds.length);

    matrixIds.forEach((a) => {
      void approveReimbursement({ id: a });
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
