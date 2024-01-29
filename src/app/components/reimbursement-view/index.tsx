import { zodResolver } from "@hookform/resolvers/zod";
import {
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/app/components/core/Button";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { AbilityContext } from "~/context/AbilityContext";
import {
  useApproveReimbursementMutation,
  useCancelReimbursementMutation,
  useHoldReimbursementMutation,
  useRejectReimbursementMutation,
} from "~/features/api/actions-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { useReportDownload } from "~/hooks/use-report-download";
import {
  OnholdReimbursementSchema,
  type OnholdReimbursementType,
} from "~/schema/reimbursement-onhold-form.schema";
import {
  RejectReimbursementSchema,
  type RejectReimbursementType,
} from "~/schema/reimbursement-reject-form.schema";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
import { currencyFormat } from "~/utils/currencyFormat";
import { env } from "../../../../env.mjs";
import Dialog from "../core/Dialog";
import EmptyState from "../core/EmptyState";
import { showToast } from "../core/Toast";
import Form from "../core/form";
import TextArea from "../core/form/fields/TextArea";
import Approvers from "./Approvers";
import Attachments from "./Attachments";
import Details from "./Details";
import Notes from "./Notes";
import Particulars from "./Particulars";
import ReimbursementViewSkeleton from "./ReimbursementViewSkeleton";
import ApproverButtons from "./action-buttons/ApproverButtons";
import FinanceButtons from "./action-buttons/FinanceButtons";
import MemberButtons from "./action-buttons/MemberButtons";

export interface ReimbursementsCardViewProps extends PropsWithChildren {
  isLoading?: boolean;
  isApproverView?: boolean;
  isHistoryView?: boolean;
  data?: IReimbursementRequest;
  closeDrawer: () => void;
  isError?: boolean;
  setFocusedReimbursementId: Dispatch<SetStateAction<number | undefined>>;
}

const ReimbursementsCardView: React.FC<ReimbursementsCardViewProps> = ({
  closeDrawer,
  data,
  isLoading = false,
  isApproverView = false,
  isHistoryView = false,
  isError = false,
  setFocusedReimbursementId,
}) => {
  const ability = useContext(AbilityContext);

  const { assignedRole } = useAppSelector((state) => state.session);
  const [currentState, setCurrentState] = useState<string>("Reject");

  const [downloadReportLoading, setDownloadReportLoading] =
    useState<boolean>(false);

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

  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      dispatch(
        appApiSlice.util.invalidateTags([
          { type: "ReimbursementApprovalList" },
        ]),
      );
      dispatch(
        appApiSlice.util.invalidateTags([{ type: "ApprovalAnalytics" }]),
      );
      setDownloadReportLoading(false);
      closeApproveDialog();
    },
    onError: () => {
      showToast({
        type: "error",
        description: "Error downloading.Please try again.",
      });
      setDownloadReportLoading(false);
      closeApproveDialog();
    },
  });

  const handleConfirmCancellation = () => {
    if (data) {
      void cancelReimbursement({
        id: data.id,
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

  const downloadReport = async () => {
    if (data) {
      setDownloadReportLoading(true);

      let filename: string = "FINANCE_REIMBURSEMENT_REPORT";

      filename = `${filename} (${data?.reimb_requestor.first_name.toUpperCase()} ${data?.reimb_requestor.last_name.toUpperCase()}-${data?.reference_no})`;

      const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/finance/download-reports?multi_reference_no=${data.reference_no}`;

      await exportReport(url, filename);

      closeDrawer();
    }
  };

  const handleApprove = () => {
    if (data) {
      const { id } = data;
      void approveReimbursement({ id })
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
    setCurrentState("On-Hold");
    if (data) {
      const payload = {
        id: data.id,
        remarks: values.remarks,
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
    setCurrentState("Reject");
    if (data) {
      const payload = {
        id: data.id,
        remarks: values.remarks,
      };

      void holdReimbursement(payload)
        .unwrap()
        .then(() => {
          dispatch(
            appApiSlice.util.invalidateTags([{ type: "ReimbursementRequest" }]),
          );
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
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {!isLoading && !isError && data && (
        <>
          <div className="flex-1 overflow-y-auto p-5 pb-[75px]">
            <Details
              request_type={data.request_type}
              request_status={data.request_status}
              // finance_request_status={data.finance_request_status}
              created_at={data.created_at}
              amount={data.total_amount}
              particulars={data.particulars}
              reimb_requestor={data.reimb_requestor}
            />

            {data.remarks &&
              (data.request_status.name === "On-hold" ||
                data.request_status.name === "Rejected" ||
                data.request_status.name === "Cancelled") && (
                <Notes note={data.remarks} />
              )}

            {data.approver_matrix && data.approver_matrix.length > 0 && (
              <Approvers
                approvers={data.approver_matrix}
                request_status={data.request_status}
              />
            )}

            <Particulars particulars={data.particulars} />

            <Attachments attachments={data.supporting_documents} />
          </div>

          <div className="absolute bottom-0 grid h-[72px] w-full grid-cols-2 items-center justify-center gap-2 border-t border-neutral-300 bg-white px-5">
            {isHistoryView && (
              <Button
                onClick={closeDrawer}
                className="w-full"
                buttonType="outlined"
                variant="neutral"
              >
                Back
              </Button>
            )}

            {!isHistoryView && !isApproverView && (
              <MemberButtons
                onClose={closeDrawer}
                onCancel={openCancelDialog}
                isCancellable={
                  !data.approver_matrix[0].is_approved &&
                  data.request_status.name !== "Cancelled" &&
                  data.request_status.name === "Pending"
                }
              />
            )}

            {!isHistoryView &&
              isApproverView &&
              ability.can("access", "REIMBURSEMENT_VIEW_APPROVAL") && (
                <ApproverButtons
                  onApprove={openApproveDialog}
                  onReject={openRejectDialog}
                />
              )}

            {!isHistoryView &&
              isApproverView &&
              ability.can("access", "REIMBURSEMENT_VIEW_DOWNLOAD_HOLD") && (
                <FinanceButtons
                  isOnHold={data.request_status.name === "On-hold"}
                  currentState={currentState}
                  onApprove={openApproveDialog}
                  onHold={openHoldDialog}
                  onReject={openRejectDialog}
                />
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
            <TextArea name="remarks" label="Reasons for Rejection" required />

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
              name="remarks"
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
              {assignedRole === "REIMBURSEMENT_FINANCE" && (
                <p className="text-neutral-800">
                  Downloading the report will change the reimbursements status
                  to processing. Are you sure you want to download{" "}
                  <strong>
                    {data?.reimb_requestor.first_name}{" "}
                    {data?.reimb_requestor.last_name}, {data?.reference_no}
                  </strong>{" "}
                  reimbursements?
                </p>
              )}

              {assignedRole !== "REIMBURSEMENT_FINANCE" && (
                <p className="text-neutral-800">
                  Are you sure you want to approve reimbursement request{" "}
                  <strong>{data.reference_no} </strong>with total amount of{" "}
                  <strong>{currencyFormat(+data.total_amount)}</strong>?
                </p>
              )}

              <div className="flex items-center gap-4">
                <Button
                  variant="neutral"
                  buttonType="outlined"
                  className="w-1/2"
                  onClick={closeApproveDialog}
                >
                  Cancel
                </Button>

                {assignedRole !== "REIMBURSEMENT_FINANCE" &&
                  assignedRole !== "REIMBURSEMENT_USER" && (
                    <Button
                      className="w-1/2"
                      onClick={handleApprove}
                      disabled={isApproving}
                      loading={isApproving}
                    >
                      Approve
                    </Button>
                  )}

                {assignedRole === "REIMBURSEMENT_FINANCE" && (
                  <Button
                    className="w-1/2"
                    variant="success"
                    onClick={() => void downloadReport()}
                    disabled={downloadReportLoading}
                    loading={downloadReportLoading}
                  >
                    Yes, Download
                  </Button>
                )}
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
