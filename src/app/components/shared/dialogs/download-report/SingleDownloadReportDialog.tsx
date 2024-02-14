import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { toggleSingleDownloadReportDialog } from "~/features/state/table-state.slice";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
import { Button } from "../../../core/Button";
import Dialog from "../../../core/Dialog";

interface SingleDownloadReportDialogProps {
  isLoading: boolean;
  onConfirm: () => void;
  selectedReimbursement?: IReimbursementRequest;
  downloadType?: "finance-approval" | "report-only";
}

const SingleDownloadReportDialog: React.FC<SingleDownloadReportDialogProps> = ({
  isLoading,
  onConfirm,
  selectedReimbursement,
  downloadType = "finance-approval",
}) => {
  const { singleDownloadReportDialogIsOpen } = useAppSelector(
    (state) => state.pageTableState,
  );
  const dispatch = useAppDispatch();

  const onAbort = () => {
    dispatch(toggleSingleDownloadReportDialog());
  };

  return (
    <Dialog
      title="Download Report"
      isVisible={singleDownloadReportDialogIsOpen}
      close={onAbort}
      hideCloseIcon
    >
      <div className="flex flex-col gap-8 pt-8">
        {selectedReimbursement && (
          <p className="text-neutral-800">
            {downloadType === "finance-approval" &&
              "Downloading the report will change the reimbursements status to processing."}{" "}
            Are you sure you want to download{" "}
            <strong>
              {selectedReimbursement.reimb_requestor.first_name}{" "}
              {selectedReimbursement.reimb_requestor.last_name},{" "}
              {selectedReimbursement.reference_no}
            </strong>{" "}
            reimbursements?
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
            aria-label="Yes,Download"
            loading={isLoading}
            disabled={isLoading}
            variant="success"
            className="w-1/2"
            onClick={onConfirm}
          >
            Yes, Download
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SingleDownloadReportDialog;
