import { useQuery } from "react-query";
import {
  type QueryFilter,
  type RequestListResponse,
  type RtkApiError,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";
import { makeRequest } from "../api-client/make-request";

class TableApiService {
  //#region ApprovalList
  private static getApprovalList = <T>(
    query: QueryFilter & { type: string },
  ) => {
    const searchParams = createSearchParams(query);
    searchParams?.delete("type");

    return makeRequest<T>({
      url: `reimbursements/request/${query.type}`,
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useApprovalList = <T = RequestListResponse>(
    query: QueryFilter & { type: string },
  ) => {
    return useQuery<T, RtkApiError>({
      queryKey: ["ApprovalList", query],
      queryFn: () => this.getApprovalList<T>(query),
    });
  };
  //#endregion

  //#region UserRequests
  private static getMyReimbursementRequests = <T>(query: QueryFilter) => {
    const searchParams = createSearchParams(query);
    return makeRequest<T>({
      url: `reimbursements/request`,
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useMyReimbursementsList = <T = RequestListResponse>(
    query: QueryFilter,
  ) => {
    return useQuery<T, RtkApiError>({
      queryKey: ["MyReimbursementsList", query],
      queryFn: () => this.getMyReimbursementRequests<T>(query),
    });
  };
  //#endregion

  //#region AdminList
  private static getAdminList = <T>(query: QueryFilter) => {
    const searchParams = createSearchParams(query);
    return makeRequest<T>({
      url: "/reimbursements/request/administrator/all",
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useAdminList = <T = RequestListResponse>(
    query: QueryFilter,
  ) => {
    return useQuery<T, RtkApiError>({
      queryKey: ["AdminList", query],
      queryFn: () => this.getAdminList<T>(query),
    });
  };
  //#endregion

  //#region HistoryList
  private static getHistoryList = <T>(
    query: QueryFilter & { type: string },
  ) => {
    const searchParams = createSearchParams(query);

    if (query.type !== "finance") {
      searchParams?.append(
        "approver_matrix__display_name",
        query.type === "hrbp" ? "HRBP" : "Manager",
      );

      if (query.request_status__id?.includes("2")) {
        const statusArray = query.request_status__id.split(",");
        searchParams?.delete("request_status__id");

        if (
          statusArray.includes("2") &&
          statusArray.filter((a) => a !== "2").length > 0
        ) {
          searchParams?.append(
            "request_status__id",
            statusArray.filter((a) => a !== "2").join(","),
          );
        }

        searchParams?.append("approver_matrix_is_approved", "True");
      }
    }
    searchParams?.delete("type");

    return makeRequest<T>({
      url: `/reimbursements/request/${query.type}/history`,
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useHistoryList = <T = RequestListResponse>(
    query: QueryFilter & { type: string },
  ) => {
    return useQuery({
      queryKey: ["HistoryList", query],
      queryFn: () => this.getHistoryList<T>(query),
      enabled: !!query.type,
    });
  };
  //#endregion
}

export default TableApiService;
