import { useMutation } from "react-query";
import { type IApproverToEdit } from "~/app/components/reimbursement-view/Approvers";
import {
  type CreditPayload,
  type OnholdReimbursementType,
  type RejectReimbursementType,
} from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";
import { type GlobalMutationOption } from "./email-action-service";

class ReimbursementActionApiService {
  //#region Approve Reimbursement
  private static approveReimbursement = (id: number) => {
    return makeRequest({
      url: `/reimbursements/request/${id}/approve`,
      method: "PATCH",
    });
  };

  public static useApproveReimbursement = (
    options?: GlobalMutationOption<{ id: number }>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["ApproveReimbursement"],
      mutationFn: ({ id }) => this.approveReimbursement(id),
    });
  };
  //#endregion

  //#region Reject Reimbursement
  private static rejectReimbursement = (
    payload: RejectReimbursementType & { id: number },
  ) => {
    return makeRequest({
      url: `/reimbursements/request/${payload.id}/reject`,
      method: "PATCH",
    });
  };

  public static useRejectReimbursement = (
    options?: GlobalMutationOption<RejectReimbursementType & { id: number }>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["RejectReimbursement"],
      mutationFn: (payload) => this.rejectReimbursement(payload),
    });
  };
  //#endregion

  //#region Cancel Reimbursement
  private static cancelReimbursement = (id: number) => {
    return makeRequest({
      url: `/reimbursements/request/${id}/cancel`,
      method: "PATCH",
    });
  };

  public static useCancelReimbursement = (
    options?: GlobalMutationOption<{ id: number }>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["CancelReimbursement"],
      mutationFn: ({ id }) => this.cancelReimbursement(id),
    });
  };
  //#endregion

  //#region Onhold Reimbursement
  private static onHoldReimbursement = (
    payload: OnholdReimbursementType & { id: number },
  ) => {
    return makeRequest({
      url: `/reimbursements/request/${payload.id}/cancel`,
      method: "PATCH",
      data: {
        remarks: payload.remarks,
      },
    });
  };

  public static useOnholdReimbursement = (
    options?: GlobalMutationOption<OnholdReimbursementType & { id: number }>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["OnholdReimbursement"],
      mutationFn: (payload) => this.onHoldReimbursement(payload),
    });
  };
  //#endregion

  //#region Re-route Approve
  private static rerouteApprover = (
    payload: IApproverToEdit & {
      new_approver_email: string;
    },
  ) => {
    return makeRequest({
      url: "/reimbursements/request/reroute/approver",
      method: "PATCH",
      data: {
        ...payload,
      },
    });
  };

  public static useRerouteApprover = (
    options?: GlobalMutationOption<
      IApproverToEdit & {
        new_approver_email: string;
      }
    >,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["RerouteApprover"],
      mutationFn: (payload) => this.rerouteApprover(payload),
    });
  };
  //#endregion

  //#region Move to Credited
  private static moveToCredited = (payload: CreditPayload) => {
    return makeRequest({
      url: "/reimbursements/request/credit",
      method: "PATCH",
      data: {
        ...payload,
      },
    });
  };

  public static useMoveToCredited = (
    options?: GlobalMutationOption<CreditPayload>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["MoveToCredited"],
      mutationFn: (payload) => this.moveToCredited(payload),
    });
  };
  //#endregion
}

export default ReimbursementActionApiService;
