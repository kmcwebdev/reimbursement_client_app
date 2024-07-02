import { useMutation, useQuery, type UseMutationOptions } from "react-query";
import { type ApprovalStatusResponse } from "~/schema/approval-status.schema";
import { type RtkApiError } from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

export type GlobalMutationOption<
  TData,
  TResponse = unknown,
> = UseMutationOptions<TResponse, RtkApiError, TData>;
class EmailActionApiService {
  //#region ApprovalStatus
  private static getApprovalStatus = <T>(query: {
    id: string;
    access_token: string;
  }) => {
    return makeRequest<T>({
      url: `reimbursements/request/${query.id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${query.access_token}`,
      },
    });
  };

  public static useApprovalStatus = <T = ApprovalStatusResponse>(query: {
    id: string;
    access_token: string;
  }) => {
    return useQuery<T, RtkApiError>({
      queryKey: ["ApprovalStatus", query],
      queryFn: () => this.getApprovalStatus<T>(query),
      enabled: !!query.id && !!query.access_token,
    });
  };
  //#endregion

  //#region Approve Reimbursement via Email
  private static approveReimbursement = (payload: {
    id: string;
    action_id: string;
    access_token: string;
  }) => {
    return makeRequest({
      url: `/reimbursements/request/${payload.id}/approve?via_email_link=true&action_id=${payload.action_id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${payload.access_token}`,
      },
    });
  };

  public static useApproveReimbursement = (
    options?: GlobalMutationOption<{
      id: string;
      action_id: string;
      access_token: string;
    }>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["ApproveReimbursementViaEmail"],
      mutationFn: (payload: {
        id: string;
        action_id: string;
        access_token: string;
      }) => this.approveReimbursement(payload),
    });
  };
  //#endregion

  //#region Reject Reimbursement via Email
  private static rejectReimbursement = (payload: {
    id: string;
    action_id: string;
    access_token: string;
    remarks: string;
  }) => {
    return makeRequest({
      url: `/reimbursements/request/${payload.id}/reject?via_email_link=true&action_id=${payload.action_id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${payload.access_token}`,
      },
      data: {
        remarks: payload.remarks,
      },
    });
  };

  public static useRejectReimbursement = (
    options?: GlobalMutationOption<{
      id: string;
      action_id: string;
      access_token: string;
      remarks: string;
    }>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["RejectReimbursementViaEmail"],
      mutationFn: (payload) => this.rejectReimbursement(payload),
    });
  };
  //#endregion
}

export default EmailActionApiService;
