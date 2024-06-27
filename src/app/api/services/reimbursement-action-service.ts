import { useMutation } from "react-query";
import { type IApproverToEdit } from "~/app/components/reimbursement-view/Approvers";
import {
  type CreditPayload,
  type OnholdReimbursementType,
  type RejectReimbursementType,
} from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

class ReimbursementActionApiService {
  //#region Approve Reimbursement
  private static approveReimbursement = (id: number) => {
    return makeRequest({
      url: `/reimbursements/request/${id}/approve`,
      method: "PATCH",
    });
  };

  public static useApproveReimbursement = (id: number) => {
    return useMutation({
      mutationKey: ["ApproveReimbursement"],
      mutationFn: () => this.approveReimbursement(id),
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
    payload: RejectReimbursementType & { id: number },
  ) => {
    return useMutation({
      mutationKey: ["RejectReimbursement"],
      mutationFn: () => this.rejectReimbursement(payload),
    });
  };
  //#endregion

  //#region Approve Reimbursement via Email
  private static approveReimbursementViaEmail = (payload: {
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

  public static useApproveReimbursementViaEmail = (payload: {
    id: string;
    action_id: string;
    access_token: string;
  }) => {
    return useMutation({
      mutationKey: ["ApproveReimbursementViaEmail"],
      mutationFn: () => this.approveReimbursementViaEmail(payload),
    });
  };
  //#endregion

  //#region Reject Reimbursement via Email
  private static rejectReimbursementViaEmail = (payload: {
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

  public static useRejectReimbursementViaEmail = (payload: {
    id: string;
    action_id: string;
    access_token: string;
    remarks: string;
  }) => {
    return useMutation({
      mutationKey: ["ApproveReimbursementViaEmail"],
      mutationFn: () => this.rejectReimbursementViaEmail(payload),
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

  public static useCancelReimbursement = (id: number) => {
    return useMutation({
      mutationKey: ["CancelReimbursement"],
      mutationFn: () => this.cancelReimbursement(id),
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
    payload: OnholdReimbursementType & { id: number },
  ) => {
    return useMutation({
      mutationKey: ["OnholdReimbursement"],
      mutationFn: () => this.onHoldReimbursement(payload),
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
    payload: IApproverToEdit & {
      new_approver_email: string;
    },
  ) => {
    return useMutation({
      mutationKey: ["RerouteApprover"],
      mutationFn: () => this.rerouteApprover(payload),
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

  public static useMoveToCredited = (payload: CreditPayload) => {
    return useMutation({
      mutationKey: ["MoveToCredited"],
      mutationFn: () => this.moveToCredited(payload),
    });
  };
  //#endregion
}

export default ReimbursementActionApiService;
