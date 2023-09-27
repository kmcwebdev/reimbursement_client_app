import React from "react";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdCreditCard } from "react-icons-all-files/md/MdCreditCard";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/components/core/DashboardCard";
import { useGetMemberAnalyticsQuery } from "~/features/reimbursement-api-slice";

const MemberAnalytics: React.FC = () => {
  const { isFetching: analyticsIsLoading, data: analytics } =
    useGetMemberAnalyticsQuery();
  return (
    <div className="mb-5 flex place-items-start gap-4 md:overflow-x-auto">
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
