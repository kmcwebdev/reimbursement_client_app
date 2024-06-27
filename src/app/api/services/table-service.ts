import { useQuery } from "react-query";
import {
  type QueryFilter,
  type RequestListResponse,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";
import { makeRequest } from "../api-client/make-request";

class TableApiService {
  //#region ApprovalList
  private static getApprovalList = (query: QueryFilter & { type: string }) => {
    const searchParams = createSearchParams(query);
    searchParams?.delete("type");

    return makeRequest<RequestListResponse>({
      url: `reimbursements/request/${query.type}`,
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useApprovalList = (query: QueryFilter & { type: string }) => {
    return useQuery({
      queryKey: ["ApprovalList", query],
      queryFn: () => this.getApprovalList(query),
    });
  };
  //#endregion

  //#region UserRequests
  private static getMyReimbursementRequests = (query: QueryFilter) => {
    const searchParams = createSearchParams(query);
    return makeRequest<RequestListResponse>({
      url: `reimbursements/request`,
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useMyReimbursementsList = (query: QueryFilter) => {
    return useQuery({
      queryKey: ["MyReimbursementsList", query],
      queryFn: () => this.getMyReimbursementRequests(query),
    });
  };
  //#endregion

  //#region AdminList
  private static getAdminList = (query: QueryFilter) => {
    const searchParams = createSearchParams(query);
    return makeRequest<RequestListResponse>({
      url: "/reimbursements/request/administrator/all",
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useAdminList = (query: QueryFilter) => {
    return useQuery({
      queryKey: ["AdminList", query],
      queryFn: () => this.getAdminList(query),
    });
  };
  //#endregion

  //#region HistoryList
  private static getHistoryList = (query: QueryFilter & { type: string }) => {
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

    return makeRequest<RequestListResponse>({
      url: `/reimbursements/request/${query.type}/history`,
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useHistoryList = (query: QueryFilter & { type: string }) => {
    return useQuery({
      queryKey: ["HistoryList", query],
      queryFn: () => this.getHistoryList(query),
      enabled: !!query.type,
    });
  };
  //#endregion
}

export default TableApiService;
