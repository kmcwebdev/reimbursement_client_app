import { useQuery } from "react-query";
import {
  type DashboardAnalytics,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

class AnalyticsApiService {
  //#region User Analytics
  private static getUserAnalytics = <T>() => {
    return makeRequest<T>({
      url: "/reimbursements/request/my-analytics",
      method: "GET",
    });
  };

  public static useUserAnalytics = <T = DashboardAnalytics>() => {
    return useQuery<T, RtkApiError>({
      queryKey: ["UserAnalytics"],
      queryFn: () => this.getUserAnalytics<T>(),
    });
  };
  //#endregion

  //#region Analytics
  private static getAnalytics = <T>(type: string) => {
    return makeRequest<T>({
      url: `/reimbursements/request/${type}/analytics`,
      method: "GET",
    });
  };

  public static useAnalytics = <T = DashboardAnalytics>(type: string) => {
    return useQuery<T, RtkApiError>({
      queryKey: ["ApprovalAnalytics", type],
      queryFn: () => this.getAnalytics<T>(type),
      enabled: !!type,
    });
  };
  //#endregion
}

export default AnalyticsApiService;
