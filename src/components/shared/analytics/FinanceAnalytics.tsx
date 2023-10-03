import React from "react";
import { AiOutlinePause } from "react-icons-all-files/ai/AiOutlinePause";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/components/core/DashboardCard";
import { useGetFinanceAnalyticsQuery } from "~/features/reimbursement-api-slice";

const FinanceAnalytics: React.FC = () => {
  const { isLoading: analyticsIsLoading, data: analytics } =
    useGetFinanceAnalyticsQuery();
  return (
    <div className="mb-5 place-items-start gap-4 md:overflow-x-auto">
      {analyticsIsLoading && (
        <div className="grid grid-cols-2 gap-3 p-4 sm:flex lg:p-0">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      )}

      {!analyticsIsLoading && analytics && (
        <>
          <div className="grid grid-cols-2 gap-3 p-4 sm:flex lg:p-0">
            <DashboardCard
              icon={
                <MdGavel className="h-4 w-4 text-orange-600 sm:h-5 sm:w-5" />
              }
              label="Pending Approval"
              count={analytics.pendingApproval.count}
            />
            <DashboardCard
              icon={
                <MdAccessTimeFilled className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              }
              label="Scheduled/Unscheduled"
              count={analytics.scheduled.count}
              totalCount={analytics.unscheduled.count}
            />
            <DashboardCard
              icon={
                <AiOutlinePause className="h-4 w-4 text-yellow-600 sm:h-5 sm:w-5" />
              }
              label="On-Hold"
              count={analytics.onhold.count}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceAnalytics;
