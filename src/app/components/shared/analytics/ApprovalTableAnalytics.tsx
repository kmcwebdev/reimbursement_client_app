import React from "react";
import { AiOutlinePause } from "react-icons-all-files/ai/AiOutlinePause";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCreditCard } from "react-icons-all-files/md/MdCreditCard";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { type DashboardAnalytics } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import DashboardCard, { DashboardCardSkeleton } from "../../core/DashboardCard";

interface ApprovalTableAnalyticsProps {
  type: string;
  isLoading: boolean;
  data: DashboardAnalytics;
}

const ApprovalTableAnalytics: React.FC<ApprovalTableAnalyticsProps> = ({
  isLoading,
  data,
  type,
}) => {
  return (
    <>
      {isLoading && (
        <div
          className={classNames(
            type === "finance" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2",
            "grid gap-3 px-4 pt-4 md:p-4 lg:p-0 xl:flex",
          )}
        >
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />

          {type === "finance" && (
            <>
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </>
          )}
        </div>
      )}

      {!isLoading && data && (
        <div
          className={classNames(
            type === "finance" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2",
            "grid gap-3 px-4 pt-4 md:p-4 lg:p-0 xl:flex",
          )}
        >
          {type === "finance" && (
            <DashboardCard
              icon={
                <MdCreditCard className="h-4 w-4 text-orange-600 sm:h-5 sm:w-5" />
              }
              label="Crediting"
              count={data.credited_request_count}
            />
          )}

          <DashboardCard
            icon={<MdGavel className="h-5 w-5 text-yellow-600" />}
            label="Pending Approval"
            count={data.pending_for_approval_count}
          />
          <DashboardCard
            icon={<MdAccessTimeFilled className="h-5 w-5 text-blue-600" />}
            label="Scheduled/Unscheduled"
            count={data.scheduled_for_approval_request_count}
            totalCount={data.unscheduled_for_approval_request_count}
          />

          {type === "finance" && (
            <DashboardCard
              icon={
                <AiOutlinePause className="h-4 w-4 text-yellow-600 sm:h-5 sm:w-5" />
              }
              label="On-Hold"
              count={data.onhold_request_count}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ApprovalTableAnalytics;
