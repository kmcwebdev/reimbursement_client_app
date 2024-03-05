/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useContext, useState, type PropsWithChildren } from "react";
import { Button } from "~/app/components/core/Button";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { AbilityContext } from "~/context/AbilityContext";
import {
  closeSideDrawer,
  toggleCancelDialog,
  toggleHoldDialog,
  toggleRejectDialog,
  toggleSingleApprovalDialog,
  toggleSingleCreditDialog,
  toggleSingleDownloadReportDialog,
} from "~/features/state/table-state.slice";
import { useReportDownload } from "~/hooks/use-report-download";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
import { env } from "../../../../env.mjs";
import EmptyState from "../core/EmptyState";
import { showToast } from "../core/Toast";
import CancelReimbursementDialog from "../shared/dialogs/CancelReimbursementDialog";
import HoldReimbursementDialog from "../shared/dialogs/HoldReimbursementDialog";
import RejectReimbursementDialog from "../shared/dialogs/RejectReimbursementDialog";

import SingleApproveReimbursementsDialog from "../shared/dialogs/approval/SingleApproveReimbursmentDialog";
import SingleDownloadReportDialog from "../shared/dialogs/download-report/SingleDownloadReportDialog";
import SingleTransitionToCreditedDialog from "../shared/dialogs/update-to-credited/SingleTransitionToCreditedDialog";
import Approvers from "./Approvers";
import Attachments from "./Attachments";
import Details from "./Details";
import Notes from "./Notes";
import Particulars from "./Particulars";
import ReimbursementViewSkeleton from "./ReimbursementViewSkeleton";
import AdminButtons from "./action-buttons/AdminButtons";
import ApproverButtons from "./action-buttons/ApproverButtons";
import FinanceButtons from "./action-buttons/FinanceButtons";
import MemberButtons from "./action-buttons/MemberButtons";

export interface ReimbursementsCardViewProps extends PropsWithChildren {
  isLoading?: boolean;
  isApproverView?: boolean;
  isHistoryView?: boolean;
  isAdminView?: boolean;
  data?: IReimbursementRequest;
  isError?: boolean;
}

const ReimbursementsCardView: React.FC<ReimbursementsCardViewProps> = ({
  data,
  isLoading = false,
  isApproverView = false,
  isHistoryView = false,
  isAdminView = false,
  isError = false,
}) => {
  const ability = useContext(AbilityContext);

  const { user, assignedRole } = useAppSelector((state) => state.session);

  const [downloadReportLoading, setDownloadReportLoading] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();

  const closeDrawer = () => {
    dispatch(closeSideDrawer());
  };

  const { download: exportReport } = useReportDownload({
    onSuccess: () => {
      dispatch(
        appApiSlice.util.invalidateTags([
          "ReimbursementRequest",
          "ReimbursementApprovalList",
          "ApprovalAnalytics",
        ]),
      );
      setDownloadReportLoading(false);
      dispatch(toggleSingleDownloadReportDialog());
    },
    onError: () => {
      showToast({
        type: "error",
        description: "Error downloading.Please try again.",
      });
      setDownloadReportLoading(false);
      dispatch(toggleSingleDownloadReportDialog());
    },
  });

  const downloadReport = async () => {
    if (data) {
      setDownloadReportLoading(true);

      let filename: string = "FINANCE_REIMBURSEMENT_REPORT";

      filename = `${filename} (${data?.reimb_requestor.first_name.toUpperCase()} ${data?.reimb_requestor.last_name.toUpperCase()}-${data?.reference_no})`;

      const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/reimbursements/request/finance/download-reports?multi_reference_no=${data.reference_no}`;

      await exportReport(url, filename);
      dispatch(
        appApiSlice.util.invalidateTags([
          "ReimbursementRequest",
          "ReimbursementApprovalList",
          "ApprovalAnalytics",
        ]),
      );

      closeDrawer();
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {!isLoading && !isError && data && (
        <>
          <div className="flex-1 overflow-y-auto p-5 pb-[75px]">
            <Details
              request_type={data.request_type}
              request_status={data.request_status}
              created_at={data.created_at}
              amount={data.total_amount}
              particulars={data.particulars}
              reimb_requestor={data.reimb_requestor}
              payroll_date={data.payroll_date}
            />

            {data.remarks &&
              (data.request_status.name === "On-hold" ||
                data.request_status.name === "Rejected" ||
                data.request_status.name === "Cancelled") && (
                <Notes note={data.remarks} />
              )}

            {user &&
              data.approver_matrix &&
              data.approver_matrix.length > 0 && (
                <Approvers
                  requestorEmail={data.reimb_requestor.email}
                  isOwnRequest={user.email === data.reimb_requestor.email}
                  approvers={data.approver_matrix}
                  request_status={data.request_status}
                />
              )}

            <Particulars particulars={data.particulars} />

            <Attachments attachments={data.supporting_documents} />
          </div>

          <div className="absolute bottom-0 grid h-[72px] w-full grid-cols-2 items-center justify-center gap-2 border-t border-neutral-300 bg-white px-5">
            {!isAdminView && isHistoryView && (
              <Button
                aria-label="Back"
                onClick={closeDrawer}
                className="w-full"
                buttonType="outlined"
                variant="neutral"
              >
                Back
              </Button>
            )}

            {!isAdminView && !isHistoryView && !isApproverView && (
              <MemberButtons
                onCancel={() => dispatch(toggleCancelDialog())}
                isCancellable={
                  !data.approver_matrix[0].is_approved &&
                  data.request_status.name !== "Cancelled" &&
                  data.request_status.name === "Pending"
                }
              />
            )}

            {!isAdminView &&
              !isHistoryView &&
              isApproverView &&
              ability.can("access", "REIMBURSEMENT_VIEW_APPROVAL") && (
                <ApproverButtons
                  onApprove={() => dispatch(toggleSingleApprovalDialog())}
                  onReject={() => dispatch(toggleRejectDialog())}
                />
              )}

            {!isAdminView &&
              !isHistoryView &&
              isApproverView &&
              ability.can("access", "REIMBURSEMENT_VIEW_DOWNLOAD_HOLD") && (
                <FinanceButtons
                  isCrediting={data.request_status.name === "Processing"}
                  onApprove={() => dispatch(toggleSingleDownloadReportDialog())}
                  onReject={() => dispatch(toggleRejectDialog())}
                  onCredit={() => dispatch(toggleSingleCreditDialog())}
                />
              )}

            {isAdminView && (
              <AdminButtons
                isOnhold={data.request_status.name === "On-hold"}
                canOnHold={
                  data.approver_matrix.find((a) => a.display_name === "HRBP")
                    ?.is_approved &&
                  !data.approver_matrix.find(
                    (a) => a.display_name === "Finance",
                  )?.is_approved &&
                  assignedRole === "REIMBURSEMENT_FINANCE"
                }
                handleOnhold={() => dispatch(toggleHoldDialog())}
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

      <RejectReimbursementDialog />
      <CancelReimbursementDialog />
      <HoldReimbursementDialog />
      <SingleApproveReimbursementsDialog selectedReimbursement={data} />

      <SingleDownloadReportDialog
        selectedReimbursement={data}
        isLoading={downloadReportLoading}
        downloadType="finance-approval"
        onConfirm={() => void downloadReport()}
      />

      <SingleTransitionToCreditedDialog selectedReimbursement={data} />
    </div>
  );
};

export default ReimbursementsCardView;
