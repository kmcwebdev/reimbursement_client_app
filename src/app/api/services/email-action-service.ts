import { useQuery } from "react-query";
import { ApprovalStatusResponse } from "~/schema/approval-status.schema";
import { RtkApiError } from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

class EmailActionService {
  //#region ApprovalStatus
  private static getApprovalStatus = (query: {
    id: string;
    access_token: string;
  }) => {
    return makeRequest<ApprovalStatusResponse>({
      url: `reimbursements/request/${query.id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${query.access_token}`,
      },
    });
  };

  public static useApprovalStatus = (query: {
    id: string;
    access_token: string;
  }) => {
    return useQuery<ApprovalStatusResponse, RtkApiError>({
      queryKey: ["ApprovalStatus", query],
      queryFn: () => this.getApprovalStatus(query),
      enabled: !!query.id && !!query.access_token,
    });
  };
  //#endregion
}

export default EmailActionService;
