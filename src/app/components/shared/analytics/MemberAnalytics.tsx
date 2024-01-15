import React from "react";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCreditCard } from "react-icons-all-files/md/MdCreditCard";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/app/components/core/DashboardCard";
import { useMemberAnalyticsQuery } from "~/features/api/analytics-api-slice";

const MemberAnalytics: React.FC = () => {
  const { isFetching: analyticsIsLoading, data: analytics } =
    useMemberAnalyticsQuery();
  return (
    <div className="grid grid-cols-2 place-items-start gap-4 p-4 md:flex md:overflow-x-auto lg:mb-5 lg:p-0">
      {analyticsIsLoading && (
        <>
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </>
      )}

      {!analyticsIsLoading && analytics && (
        <>
          <DashboardCard
            icon={<MdAccessTimeFilled className="h-5 w-5 text-yellow-600" />}
            label="Pending Approval"
            count={analytics.pendingApproval.count}
          />
          <DashboardCard
            icon={<MdCreditCard className="text-informative-600 h-5 w-5" />}
            label="Overall Total"
            count={analytics.overall.count}
          />
        </>
      )}
    </div>
  );
};

export default MemberAnalytics;
