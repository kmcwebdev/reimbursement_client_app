import React from "react";
import { FaThList } from "react-icons-all-files/fa/FaThList";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import AnalyticsApiService from "~/app/api/services/analytics-service";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/app/components/core/DashboardCard";

const AdminAnalytics: React.FC = () => {
  const { isLoading: analyticsIsLoading, data: analytics } =
    AnalyticsApiService.useAnalytics("administrator");

  return (
    <div>
      {analyticsIsLoading && (
        <div className="grid grid-cols-2 gap-3 px-4 pt-4 md:grid-cols-3 md:px-0 md:py-4 lg:flex lg:p-0">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      )}

      {!analyticsIsLoading && analytics && (
        <div className="grid grid-cols-2 gap-3 px-4 pt-4 md:grid-cols-3 md:px-0 md:py-4 lg:flex lg:p-0">
          <DashboardCard
            icon={
              <FaThList className="h-4 w-4 text-orange-600 sm:h-5 sm:w-5" />
            }
            label="All Reimbursements"
            count={analytics.all_reimb_request_count}
          />

          <DashboardCard
            icon={<MdGavel className="h-4 w-4 text-yellow-600 sm:h-5 sm:w-5" />}
            label="On-Hold"
            count={analytics.onhold_request_count}
          />

          <DashboardCard
            icon={
              <MdAccessTimeFilled className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
            }
            label="Scheduled/Unscheduled"
            count={analytics.scheduled_for_approval_request_count}
            totalCount={analytics.unscheduled_for_approval_request_count}
          />
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
