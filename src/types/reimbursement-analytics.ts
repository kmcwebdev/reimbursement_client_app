export type ReimbursementAnalyticsType = {
  myPendingRequest: { count: number };
  myTotalRequest: { count: number };
  others: {
    totalScheduledRequest: {
      count: number;
    };
    totalUnScheduledRequest: {
      count: number;
    };
    totalOnholdRequest: {
      count: number;
    };
  } | null;
};
