import { useQuery } from "react-query";
import {
  type QueryFilter,
  type RequestListResponse,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";
import { makeRequest } from "../api-client/make-request";

class GetMyReimbursementList {
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
      queryKey: ["MyReimbursementsList"],
      queryFn: () => this.getMyReimbursementRequests(query),
    });
  };
}

export default GetMyReimbursementList.useMyReimbursementsList;
