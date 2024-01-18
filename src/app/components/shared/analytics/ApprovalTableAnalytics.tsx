import React from "react";
import { AiOutlinePause } from "react-icons-all-files/ai/AiOutlinePause";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { type IMyAnalytics } from "~/types/dashboard-analytics.type";
import DashboardCard, { DashboardCardSkeleton } from "../../core/DashboardCard";

interface ApprovalTableAnalyticsProps {
  type: string;
  isLoading: boolean;
  data: IMyAnalytics;
}

const ApprovalTableAnalytics: React.FC<ApprovalTableAnalyticsProps> = ({
  isLoading,
  data,
  type,
}) => {
  return (
    <div className="flex gap-4 p-4 lg:mb-5 lg:p-0">
      {isLoading && (
        <>
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </>
      )}

      {!isLoading && data && (
        <>
          <DashboardCard
            icon={<MdGavel className="h-5 w-5 text-yellow-600" />}
            label="Pending Approval"
            count={data.pending_request_count}
          />
          <DashboardCard
            icon={<MdAccessTimeFilled className="h-5 w-5 text-blue-600" />}
            label="Scheduled/Unscheduled"
            count={data.scheduled_request_count}
            totalCount={data.unscheduled_request_count}
          />

          {type === "finance" && (
            <DashboardCard
              icon={
                <AiOutlinePause className="h-4 w-4 text-yellow-600 sm:h-5 sm:w-5" />
              }
              label="On-Hold"
              count={10}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ApprovalTableAnalytics;