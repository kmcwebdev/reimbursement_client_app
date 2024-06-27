import { useQuery } from "react-query";
import {
  type DashboardAnalytics,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

class AnalyticsApiService {
  //#region User Analytics
  private static getUserAnalytics = () => {
    return makeRequest<DashboardAnalytics>({
      url: "/reimbursements/request/my-analytics",
      method: "GET",
    });
  };

  public static useUserAnalytics = () => {
    return useQuery<DashboardAnalytics, RtkApiError>({
      queryKey: ["UserAnalytics"],
      queryFn: this.getUserAnalytics,
    });
  };
  //#endregion

  //#region Analytics
  private static getAnalytics = (type: string) => {
    return makeRequest<DashboardAnalytics>({
      url: `/reimbursements/request/${type}/analytics`,
      method: "GET",
    });
  };

  public static useAnalytics = (type: string) => {
    return useQuery<DashboardAnalytics, RtkApiError>({
      queryKey: ["ApprovalAnalytics", type],
      queryFn: () => this.getAnalytics(type),
      enabled: !!type,
    });
  };
  //#endregion
}

export default AnalyticsApiService;
