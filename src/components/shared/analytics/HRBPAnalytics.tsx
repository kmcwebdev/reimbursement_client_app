import React from "react";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/components/core/DashboardCard";
import { useGetHRBPAnalyticsQuery } from "~/features/reimbursement-api-slice";

const HRBPAnalytics: React.FC = () => {
  const { isLoading: analyticsIsLoading, data: analytics } =
    useGetHRBPAnalyticsQuery();
  return (
    <div className="mb-5 flex gap-4">
      {analyticsIsLoading && (
        <>
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </>
      )}

      {!analyticsIsLoading && analytics && (
        <>
          <DashboardCard
            icon={<MdGavel className="h-5 w-5 text-yellow-600" />}
            label="Pending Approval"
            count={analytics.pendingApproval.count}
          />
          <DashboardCard
            icon={<MdAccessTimeFilled className="h-5 w-5 text-blue-600" />}
            label="Scheduled/Unscheduled"
            count={analytics.scheduled.count}
            totalCount={analytics.unscheduled.count}
          />
        </>
      )}
    </div>
  );
};

export default HRBPAnalytics;
