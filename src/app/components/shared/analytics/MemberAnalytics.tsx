import React from "react";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCreditCard } from "react-icons-all-files/md/MdCreditCard";
import AnalyticsApiService from "~/app/api/services/analytics-service";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/app/components/core/DashboardCard";

const MemberAnalytics: React.FC = () => {
  const { isFetching: analyticsIsLoading, data: analytics } =
    AnalyticsApiService.useUserAnalytics();

  return (
    <div>
      {analyticsIsLoading && (
        <div className="grid grid-cols-2 gap-3 px-4 pt-4 md:px-0 md:py-4 lg:flex">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      )}

      {!analyticsIsLoading && analytics && (
        <div className="grid grid-cols-2 gap-3 px-4 pt-4 md:px-0 md:py-4 lg:flex">
          <DashboardCard
            icon={<MdAccessTimeFilled className="h-5 w-5 text-yellow-600" />}
            label="Pending Approval"
            count={analytics.pending_request_count}
          />
          <DashboardCard
            icon={<MdCreditCard className="text-informative-600 h-5 w-5" />}
            label="Overall Total"
            count={analytics.overall_request_count}
          />
        </div>
      )}
    </div>
  );
};

export default MemberAnalytics;
