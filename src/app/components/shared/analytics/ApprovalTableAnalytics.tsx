import React from "react";
import { AiOutlinePause } from "react-icons-all-files/ai/AiOutlinePause";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { type IAnalytics } from "~/types/dashboard-analytics.type";
import { classNames } from "~/utils/classNames";
import DashboardCard, { DashboardCardSkeleton } from "../../core/DashboardCard";

interface ApprovalTableAnalyticsProps {
  type: string;
  isLoading: boolean;
  data: IAnalytics;
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
            type === "finance" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2",
            "grid gap-3 px-4 pt-4 md:p-4 lg:flex lg:p-0",
          )}
        >
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />

          {type === "finance" && <DashboardCardSkeleton />}
        </div>
      )}

      {!isLoading && data && (
        <div
          className={classNames(
            type === "finance" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2",
            "grid gap-3 px-4 pt-4 md:p-4 lg:flex lg:p-0",
          )}
        >
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
