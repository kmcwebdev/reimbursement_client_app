import { useQuery } from "react-query";
import {
  type QueryFilter,
  type RequestListResponse,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";
import { makeRequest } from "../api-client/make-request";

class GetMyApprovalList {
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
      queryKey: ["ApprovalList", query.type],
      queryFn: () => this.getApprovalList(query),
    });
  };
}

export default GetMyApprovalList.useApprovalList;
