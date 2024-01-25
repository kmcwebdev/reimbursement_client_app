export type IAnalytics = {
  pending_request_count: number;
  scheduled_request_count: number;
  unscheduled_request_count: number;
  overall_request_count: number;

  pending_for_approval_count: number;
  scheduled_for_approval_request_count: number;
  unscheduled_for_approval_request_count: number;
  credited_request_count: number;
  cancelled_request_count: number;
  rejected_request_count: number;
  onhold_request_count: number;
  administrator_analytics: number;
  all_reimb_request_count: number;
};
