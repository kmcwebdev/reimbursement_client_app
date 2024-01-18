export type IFinanceAnalytics = {
  onhold: IAnalytics;
  pendingApproval: IAnalytics;
  scheduled: IAnalytics;
  unscheduled: IAnalytics;
};

export type IHRBPAnalytics = Omit<IFinanceAnalytics, "onhold">;
export type IManagerAnalytics = Omit<IFinanceAnalytics, "onhold">;

export interface IMemberAnalytics
  extends Omit<IFinanceAnalytics, "scheduled" & "unscheduled" & "onhold"> {
  overall: IAnalytics;
}

interface IAnalytics {
  count: string;
}

export type IMyAnalytics = {
  pending_request_count: number;
  scheduled_request_count: number;
  unscheduled_request_count: number;
};
