import { zodResolver } from "@hookform/resolvers/zod";
import { type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { Button } from "~/components/core/Button";
import {
  useApproveReimbursementMutation,
  useCancelReimbursementMutation,
  useRejectReimbursementMutation,
} from "~/features/reimbursement-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
  RejectReimbursementSchema,
  type RejectReimbursementType,
} from "~/schema/reimbursement-reject-form.schema";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import Dialog from "../core/Dialog";
import EmptyState from "../core/EmptyState";
import { showToast } from "../core/Toast";
import Form from "../core/form";
import TextArea from "../core/form/fields/TextArea";
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
  const [approveReimbursement, { isLoading: isApproving }] =
    useApproveReimbursementMutation();

  const [rejectReimbursement, { isLoading: isRejecting }] =
    useRejectReimbursementMutation();

  const [cancelReimbursement, { isLoading: isCancelling }] =
    useCancelReimbursementMutation();

  const dispatch = useAppDispatch();

  const {
    isVisible: cancelDialogIsOpen,
    open: openCancelDialog,
    close: closeCancelDialog,
  } = useDialogState();

  const {
    isVisible: approveDialogIsOpen,
    open: openApproveDialog,
    close: closeApproveDialog,
  } = useDialogState();

  const {
    isVisible: rejectDialogIsOpen,
    open: openRejectDialog,
    close: closeRejectDialog,
  } = useDialogState();

  const useRejectFormReturn = useForm<RejectReimbursementType>({
    resolver: zodResolver(RejectReimbursementSchema),
    mode: "onChange",
  });

  const handleConfirmCancellation = () => {
    if (data) {
      void cancelReimbursement({
        reimbursement_request_id: data.reimbursement_request_id,
      })
        .unwrap()
        .then(() => {
          showToast({
            type: "success",
            description: "Reimbursement Request successfully cancelled!",
          });
          closeDrawer();
          useRejectFormReturn.reset();
        })
        .catch(() => {
          showToast({
            type: "error",
            description: "Cancellation failed!",
          });
        });
    }
  };

  const handleApprove = () => {
    if (data) {
      const payload = { approval_matrix_ids: [data.next_approval_matrix_id] };

      void approveReimbursement(payload)
        .unwrap()
        .then(() => {
          dispatch(
            appApiSlice.util.invalidateTags([{ type: "ReimbursementRequest" }]),
          );
          showToast({
            type: "success",
            description: "Reimbursement Request successfully approved!",
          });
          closeApproveDialog();
          closeDrawer();
        })
        .catch(() => {
          showToast({
            type: "error",
            description: "Approval failed!",
          });
        });
    }
  };

  const handleConfirmReject = (values: RejectReimbursementType) => {
    if (data) {
      const payload = {
        approval_matrix_id: data.approval_matrix_id,
        reason_for_rejection: values.reason_for_rejection,
      };

      void rejectReimbursement(payload)
        .unwrap()
        .then(() => {
          showToast({
            type: "success",
            description: "Reimbursement Request successfully rejected!",
          });
          closeRejectDialog();
          closeDrawer();
          useRejectFormReturn.reset();
        })
        .catch(() => {
          showToast({
            type: "error",
            description: "Rejection failed!",
          });
        });
    }
  };

  const handleCloseRejectDialog = () => {
    useRejectFormReturn.reset();
    closeRejectDialog();
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {!isLoading && !isError && data && (
        <>
          <div className="flex-1 p-5">
            <Details
              request_status={data.request_status}
              request_type={data.request_type}
              expense_type={data.expense_type}
              created_at={data.created_at}
              amount={data.amount}
              remarks={data.remarks}
            />

            {data.request_status === "Rejected" && (
              <Notes note="Missing details" />
            )}

            <Approvers approvers={data.approvers} />

            <Attachments
              attachment={data.attachment}
              attachment_mask_name={data.attachment_mask_name}
            />
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
                  onClick={openRejectDialog}
                >
                  Reject
                </Button>
                <Button
                  className="w-full"
                  variant="primary"
                  disabled={isApproving}
                  loading={isApproving}
                  onClick={openApproveDialog}
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
        title="Reject Reimbursement?"
        isVisible={rejectDialogIsOpen}
        close={closeRejectDialog}
        hideCloseIcon
      >
        <Form
          name="rejectReimbursementForm"
          useFormReturn={useRejectFormReturn}
          onSubmit={handleConfirmReject}
        >
          <div className="flex flex-col gap-8 pt-8">
            <TextArea
              name="reason_for_rejection"
              label="Reasons for Rejection"
              required
            />

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="neutral"
                buttonType="outlined"
                className="w-1/2"
                onClick={handleCloseRejectDialog}
              >
                Cancel
              </Button>
              <Button
                className="w-1/2"
                variant="danger"
                type="submit"
                disabled={isRejecting}
                loading={isRejecting}
              >
                Reject
              </Button>
            </div>
          </div>
        </Form>
      </Dialog>

      <Dialog
        title="Approve Reimbursement?"
        isVisible={approveDialogIsOpen}
        close={closeApproveDialog}
        hideCloseIcon
      >
        <div className="flex flex-col gap-8 pt-8">
          {data && (
            <>
              <p className="text-neutral-800">
                Are you sure you want to approve reimbursement request{" "}
                {data.reference_no} with total amount of{" "}
                {currencyFormat(+data.amount)}
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="neutral"
                  buttonType="outlined"
                  className="w-1/2"
                  onClick={closeApproveDialog}
                >
                  Cancel
                </Button>
                <Button
                  className="w-1/2"
                  onClick={handleApprove}
                  disabled={isApproving}
                  loading={isApproving}
                >
                  Approve
                </Button>
              </div>
            </>
          )}
        </div>
      </Dialog>

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
              disabled={isCancelling}
            >
              No
            </Button>
            <Button
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
    </div>
  );
};

export default ReimbursementsCardView;
