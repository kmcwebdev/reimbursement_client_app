/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { Button } from "~/components/core/Button";
import {
  useApproveReimbursementMutation,
  useAuditLogsQuery,
  useCancelReimbursementMutation,
  useHoldReimbursementMutation,
  useRejectReimbursementMutation,
} from "~/features/reimbursement-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
  OnholdReimbursementSchema,
  type OnholdReimbursementType,
} from "~/schema/reimbursement-onhold-form.schema";
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
  isLoading?: boolean;
  isApproverView?: boolean;
  data?: ReimbursementRequest;
  closeDrawer: () => void;
  isError?: boolean;
  setFocusedReimbursementId: Dispatch<SetStateAction<string | undefined>>;
}

const ReimbursementsCardView: React.FC<ReimbursementsCardViewProps> = ({
  closeDrawer,
  data,
  isLoading = false,
  isApproverView = false,
  isError = false,
  setFocusedReimbursementId,
}) => {
  const { user } = useAppSelector((state) => state.session);
  const [reimbursementReqId,setReimbursementReqId] = useState<string>();

  useMemo(()=>{
 if(data){
  setReimbursementReqId(data.reimbursement_request_id)
 }
  },[data])

  const {data:auditLog,isFetching:auditLogIsFetching}=useAuditLogsQuery({reimbursement_request_id:reimbursementReqId!},{skip:!reimbursementReqId})
  const [approveReimbursement, { isLoading: isApproving }] =
    useApproveReimbursementMutation();

  const [rejectReimbursement, { isLoading: isRejecting }] =
    useRejectReimbursementMutation();

  const [holdReimbursement, { isLoading: isOnHolding }] =
    useHoldReimbursementMutation();

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

  const {
    isVisible: holdDialogIsOpen,
    open: openHoldDialog,
    close: closeHoldDialog,
  } = useDialogState();

  const useRejectFormReturn = useForm<RejectReimbursementType>({
    resolver: zodResolver(RejectReimbursementSchema),
    mode: "onChange",
  });

  const useHoldFormReturn = useForm<OnholdReimbursementType>({
    resolver: zodResolver(OnholdReimbursementSchema),
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
          setFocusedReimbursementId(undefined);
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
        approval_matrix_id: user && user.assignedRole === 'Finance'
          ? data.reimbursement_request_id
          : data.next_approval_matrix_id,
        rejection_reason: values.rejection_reason,
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

  const handleConfirmHold = (values: OnholdReimbursementType) => {
    if (data) {
      const payload = {
        reimbursement_request_id: data.reimbursement_request_id,
        onhold_reason: values.onhold_reason,
      };

      void holdReimbursement(payload)
        .unwrap()
        .then(() => {
          showToast({
            type: "success",
            description: "Reimbursement Request successfully put onhold!",
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

  const handleCloseOnHoldDialog = () => {
    useHoldFormReturn.reset();
    closeHoldDialog();
  };


  return (
    <div className="relative flex h-full w-full flex-col">
      {!isLoading && !isError && data && (
        <>
          <div className="flex-1 p-5">
            <Details
              request_type={data.request_type}
              requestor_request_status={data.requestor_request_status}
              hrbp_request_status={data.hrbp_request_status}
              finance_request_status={data.finance_request_status}
              expense_type={data.expense_type}
              created_at={data.created_at}
              amount={data.amount}
              remarks={data.remarks}
              user={user?.assignedRole}
            />

            {(data.finance_request_status === "On-hold" || data.finance_request_status === "Rejected") && (

              <>
              {!auditLogIsFetching && auditLog && auditLog.length > 0 &&
              <Notes note={auditLog[0].description} />
              }
              </>
            )}

            {data.approvers && data.approvers.length > 0 && (
              <Approvers approvers={data.approvers} />
            )}

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

                {data.requestor_request_status !== "Cancelled" &&
                  data.requestor_request_status === "Pending" && (
                    <Button
                      className="w-full"
                      variant="danger"
                      onClick={openCancelDialog}
                    >
                      Cancel
                    </Button>
                  )}
              </>
            )}

            {user &&
              (user.assignedRole === "HRBP" ||
                user.assignedRole ===
                  "External Reimbursement Approver Manager") &&
              isApproverView && (
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

            {user && user.assignedRole === "Finance" && (
              <>
                <div className="grid w-full grid-cols-2 gap-2">
                  <Button
                    className="w-full"
                    buttonType="outlined"
                    variant="warning"
                    onClick={openHoldDialog}
                    disabled={data.request_status === "On-hold"}
                    loading={isOnHolding}
                  >
                    Hold
                  </Button>

                  <Button
                    className="w-full"
                    buttonType="outlined"
                    variant="danger"
                    loading={isRejecting}
                    onClick={openRejectDialog}
                  >
                    Reject
                  </Button>
                </div>
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
              name="rejection_reason"
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
        title="Hold Reimbursement?"
        isVisible={holdDialogIsOpen}
        close={closeHoldDialog}
        hideCloseIcon
      >
        <Form
          name="holdReimbursementForm"
          useFormReturn={useHoldFormReturn}
          onSubmit={handleConfirmHold}
        >
          <div className="flex flex-col gap-8 pt-8">
            <TextArea
              name="onhold_reason"
              label="Reasons for putting on hold"
              required
            />

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="neutral"
                buttonType="outlined"
                className="w-1/2"
                onClick={handleCloseOnHoldDialog}
              >
                Cancel
              </Button>
              <Button
                className="w-1/2"
                variant="warning"
                type="submit"
                disabled={isOnHolding}
                loading={isOnHolding}
              >
                Hold
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
