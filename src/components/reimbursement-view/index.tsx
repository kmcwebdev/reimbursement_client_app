/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
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
import Popover from "../core/Popover";
import { BsChevronDown } from "react-icons-all-files/bs/BsChevronDown";
import { AiOutlineStop } from "react-icons-all-files/ai/AiOutlineStop";
import { AiOutlinePauseCircle } from "react-icons-all-files/ai/AiOutlinePauseCircle";
import axios, { type AxiosResponse } from "axios";
import { env } from "~/env.mjs";

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
  const { user, accessToken } = useAppSelector((state) => state.session);
  const [reimbursementReqId, setReimbursementReqId] = useState<string>();
  const [ currentState, setCurrentState ] = useState<string>('Reject');

  useMemo(() => {
    if (data) {
      setReimbursementReqId(data.reimbursement_request_id);
    }
  }, [data]);

  const [downloadReportLoading, setDownloadReportLoading] = useState(false);
  const { data: auditLog, isFetching: auditLogIsFetching } = useAuditLogsQuery(
    { reimbursement_request_id: reimbursementReqId! },
    { skip: !reimbursementReqId },
  );
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

  const downloadReport = async () => {
    setDownloadReportLoading(true)
    console.log(data?.reimbursement_request_id);
    const response = await axios.get<unknown, AxiosResponse<Blob>>(
      `${env.NEXT_PUBLIC_BASEAPI_URL}/api/finance/reimbursements/requests/reports/finance`,
      {
        responseType: "blob", // Important to set this
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${accessToken}`,
        },
        params: { reimbursement_request_ids: JSON.stringify([data?.reimbursement_request_id]) },
      },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filename.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    dispatch(appApiSlice.util.invalidateTags([{type: "ReimbursementApprovalList"}]));
    setDownloadReportLoading(false);
    closeApproveDialog();
    closeDrawer();
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
  }

  const handleConfirmReject = (values: RejectReimbursementType) => {
    setCurrentState("On-Hold")
    if (data) {
      const payload = {
        approval_matrix_id:
          user && user.assignedRole === "Finance"
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
    setCurrentState("Reject")
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

            {(data.finance_request_status === "On-hold" ||
              data.finance_request_status === "Rejected" ||
              data.finance_request_status === "Cancelled") && (
              <>
                {!auditLogIsFetching && auditLog && auditLog.length > 0 && (
                  <Notes note={auditLog[0].description} />
                )}
              </>
            )}

            {data.approvers && data.approvers.length > 0 && (
              <Approvers
                approvers={data.approvers}
                finance_request_status={data.finance_request_status}
                hrbp_request_status={data.hrbp_request_status}
              />
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
                  data.requestor_request_status === "Pending" &&
                  data.finance_request_status === "Pending" && 
                  data.hrbp_request_status === "Pending" && (
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
                <div className="absolute bottom-0 grid h-[72px] w-full grid-cols-2 items-center justify-center gap-2 border-t border-neutral-300 px-5">
                  {data.finance_request_status !== "On-hold" && (
                    <Popover
                      panelClassName="translate-y-[-170px] w-full"
                      btn={
                        <div className="flex justify-between h-full border border-s-1 p-2 rounded-md divide-x-2">
                          <div className="flex flex-1 h-full items-center justify-center gap-2">
                              {currentState === "Reject" && 
                                <AiOutlineStop className="text-red-600 w-6 h-6" /> ||<AiOutlinePauseCircle className="text-yellow-600 w-6 h-6" />
                              }
                              <p className={currentState === "Reject" ? "text-red-600" : "text-yellow-600"}>{currentState}</p>
                          </div>
                          <div className="w-[40px] grid place-items-center">
                            <BsChevronDown className="w-[14px] h-[14px] text-gray-400 font-semibold "/>
                          </div>
                        </div>

                      }
                      content={
                        <div className="w-full p-2">
                          <div className="flex justify-start gap-2 items-center p-2 hover:bg-gray-100 rounded-sm cursor-pointer" onClick={openRejectDialog}>
                            <AiOutlineStop className="text-red-600 w-6 h-6" />
                            <p className="font-normal text-[16px] font-karla">Reject</p>
                          </div>
                          <div className="flex justify-start gap-2 items-center p-2 hover:bg-gray-100 rounded-sm cursor-pointer" onClick={openHoldDialog}>
                            <AiOutlinePauseCircle className="text-yellow-600 w-6 h-6" />
                            <p className="font-normal text-[16px] font-karla">Hold</p>
                          </div>
                        </div>
                      }
                    />
                  )}
                  { data.finance_request_status === "On-hold" && (
                    <Button
                      className="w-full"
                      buttonType="outlined"
                      variant="danger"
                      loading={isRejecting}
                      onClick={openRejectDialog}
                    >
                      Reject
                    </Button>
                  ) }
                  <Button
                    className="w-full"
                    buttonType="filled"
                    variant="success"
                    loading={isRejecting}
                    onClick={openApproveDialog}
                  >
                    Download
                  </Button>
                </div>
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
                <strong>{data.reference_no} </strong>with total amount of{" "}
                <strong>{currencyFormat(+data.amount)}</strong>
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

                {user?.assignedRole !== "Finance" && user?.assignedRole !== "Member" && (
                  <Button
                    className="w-1/2"
                    onClick={handleApprove}
                    disabled={isApproving}
                    loading={isApproving}
                  >
                    Approve
                  </Button>
                ) }

                {user?.assignedRole === "Finance" && (
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
