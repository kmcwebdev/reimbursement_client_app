import { type PropsWithChildren } from "react";
import { Button } from "~/components/core/Button";
import { type StatusType } from "~/components/core/StatusBadge";
import { useApproveReimbursementMutation } from "~/features/reimbursement-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import Dialog from "../core/Dialog";
import EmptyState from "../core/EmptyState";
import { showToast } from "../core/Toast";
import Approvers from "./Approvers";
import Attachments from "./Attachments";
import Details from "./Details";
import Notes from "./Notes";
import ReimbursementViewSkeleton from "./ReimbursementViewSkeleton";

export interface ReimbursementsCardViewProps extends PropsWithChildren {
  isApproverView?: boolean;
  isLoading?: boolean;
  data?: ReimbursementRequest;
  closeDrawer: () => void;
  isError?: boolean;
}

const ReimbursementsCardView: React.FC<ReimbursementsCardViewProps> = ({
  isApproverView = false,
  closeDrawer,
  data,
  isLoading = false,
  isError = false,
}) => {
  const [approveReimbursement, { isLoading: isSubmitting }] =
    useApproveReimbursementMutation();

  const {
    isVisible: cancelDialogIsOpen,
    open: openCancelDialog,
    close: closeCancelDialog,
  } = useDialogState();

  const handleConfirmCancellation = () => {
    //handle cancel request here
    closeCancelDialog();
  };

  const handleApprove = (matrixId: string) => {
    void approveReimbursement({ matrixId })
      .unwrap()
      .then(() => {
        showToast({
          type: "success",
          description:
            "Your reimbursement request has been submitted successfully!",
        });
        closeDrawer();
      })
      .catch(() => {
        showToast({
          type: "error",
          description: "Approval failed!",
        });
      });
  };

  console.log("approvers", data);

  return (
    <div className="relative flex h-full w-full flex-col">
      {!isLoading && !isError && data && (
        <>
          <div className="flex-1 p-5">
            <Details
              statusDetails={data.request_status.toLowerCase() as StatusType}
              type={data.request_type}
              expense={data.expense_type}
              remarks={data.remarks}
              filed={data.created_at}
              amount={data.amount}
            />

            {data.request_status === "rejected" && (
              <Notes note="Missing details" />
            )}

            <Approvers
              status={data.request_status}
              approvers="Missing details"
              daterejected="Missing details"
            />

            <Attachments attachment={data.attachment} />
          </div>

          <div className="absolute bottom-0 grid h-[72px] w-full grid-cols-2 items-center justify-center gap-2 border-t border-neutral-300 px-5">
            {!isApproverView && (
              <>
                <Button
                  onClick={closeDrawer}
                  className="w-full"
                  buttonType="outlined"
                  variant="neutral"
                >
                  Back
                </Button>
                <Button
                  className="w-full"
                  variant="danger"
                  onClick={openCancelDialog}
                >
                  Cancel Request
                </Button>
              </>
            )}

            {isApproverView && (
              <>
                <Button
                  className="w-full"
                  buttonType="outlined"
                  variant="danger"
                >
                  Reject
                </Button>
                <Button
                  className="w-full"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  onClick={() => handleApprove(data.approval_matrix_id)}
                >
                  Approve
                </Button>
              </>
            )}
          </div>
        </>
      )}

      {isLoading && <ReimbursementViewSkeleton />}

      {!isLoading && isError && (
        <div className="grid px-8 pt-16">
          <EmptyState
            title="Reimbursement Request not found!"
            description="Sorry, the reimbursement request you are looking for could not be found."
          />
        </div>
      )}

      <Dialog
        title="Cancel Reimbursements?"
        isVisible={cancelDialogIsOpen}
        close={closeCancelDialog}
      >
        <div className="flex flex-col gap-8 pt-8">
          <p className="text-neutral-800">
            Are you sure you want to cancel reimbursement request?
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={closeCancelDialog}
            >
              No
            </Button>
            <Button
              variant="danger"
              className="w-1/2"
              onClick={handleConfirmCancellation}
            >
              Yes
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ReimbursementsCardView;
