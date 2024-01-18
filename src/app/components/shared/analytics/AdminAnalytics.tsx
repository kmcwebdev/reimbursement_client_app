import React from "react";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { FaThList } from "react-icons-all-files/fa/FaThList";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import DashboardCard, {
//   DashboardCardSkeleton,
} from "~/app/components/core/DashboardCard";
// import { useFinanceAnalyticsQuery } from "~/features/api/analytics-api-slice";

const AdminAnalytics: React.FC = () => {
//   const { isLoading: analyticsIsLoading, data: analytics } =
//     useFinanceAnalyticsQuery();
  return (
    <div className="mb-5 place-items-start gap-4 md:overflow-x-auto">
        {/* IMPORTANT */}
        {/* UNCOMMENT THIS WHEN API FOR ANALYTICS IS AVAILABLE */}
      {/* {analyticsIsLoading && (
        <div className="grid grid-cols-2 gap-3 p-4 sm:flex lg:p-0">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      )} */}

      {/* {!analyticsIsLoading && analytics && ( */}
        <div className="grid grid-cols-2 gap-3 p-4 sm:flex lg:p-0">
          <DashboardCard
            icon={<FaThList className="h-4 w-4 text-orange-600 sm:h-5 sm:w-5" />}
            label="All Reimbursements"
            count='100'
          />
          
          <DashboardCard
            icon={
              <MdGavel className="h-4 w-4 text-yellow-600 sm:h-5 sm:w-5" />
            }
            label="On-Hold"
            count='16'
          />
          
          <DashboardCard
          icon={
            <MdAccessTimeFilled className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
          }
          label="Scheduled/Unscheduled"
          count='50'
          totalCount='20'
        />
        </div>
      {/* )} */}
    </div>
  );
};

export default AdminAnalytics;