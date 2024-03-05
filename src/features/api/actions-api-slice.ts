import { type IApproverToEdit } from "~/app/components/reimbursement-view/Approvers";
import { appApiSlice } from "~/app/rtkQuery";
import { type OnholdReimbursementType } from "~/schema/reimbursement-onhold-form.schema";
import { type RejectReimbursementType } from "~/schema/reimbursement-reject-form.schema";
import {
  type CreditPayload,
  type IReimbursementRequest,
} from "~/types/reimbursement.types";

/**
 * ACTIONS API SLICE
 *
 * Dedicated endpoints used for reimbursement approval process.
 */

export const actionsApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    approveReimbursement: builder.mutation<
      unknown,
      Pick<IReimbursementRequest, "id">
    >({
      query: ({ id }) => {
        return {
          url: `/reimbursements/request/${id}/approve`,
          method: "PATCH",
        };
      },
      invalidatesTags: [
        "ReimbursementRequest",
        "ReimbursementHistoryList",
        "ReimbursementApprovalList",
        "ApprovalAnalytics",
      ],
    }),
    rejectReimbursement: builder.mutation<
      unknown,
      RejectReimbursementType & { id: number }
    >({
      query: (data) => {
        return {
          url: `/reimbursements/request/${data.id}/reject`,
          method: "PATCH",
          body: {
            remarks: data.remarks,
          },
        };
      },
      invalidatesTags: [
        "ReimbursementHistoryList",
        "ReimbursementApprovalList",
        "ApprovalAnalytics",
      ],
    }),
    approveReimbursementViaEmail: builder.mutation<
      unknown,
      { id: string; action_id: string; access_token: string }
    >({
      query: (data) => ({
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
        url: `/reimbursements/request/${data.id}/approve?via_email_link=true&action_id=${data.action_id}`,
      }),
    }),
    rejectReimbursementViaEmail: builder.mutation<
      unknown,
      { id: string; action_id: string; remarks: string; access_token: string }
    >({
      query: (data) => ({
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
        url: `/reimbursements/request/${data.id}/reject?via_email_link=true&action_id=${data.action_id}`,
        body: {
          remarks: data.remarks,
        },
      }),
      invalidatesTags: [
        "ReimbursementApprovalList",
        "ReimbursementHistoryList",
        "ApprovalAnalytics",
      ],
    }),
    cancelReimbursement: builder.mutation<
      unknown,
      {
        id: number;
      }
    >({
      query: (data) => {
        return {
          url: `/reimbursements/request/${data.id}/cancel`,
          method: "PATCH",
        };
      },
      invalidatesTags: [
        "MyRequests",
        "ReimbursementRequestList",
        "MyAnalytics",
        "ApprovalAnalytics",
        "ReimbursementHistoryList",
      ],
    }),
    holdReimbursement: builder.mutation<
      unknown,
      OnholdReimbursementType & {
        id: number;
      }
    >({
      query: (data) => {
        return {
          url: `/reimbursements/request/${data.id}/on-hold`,
          method: "PATCH",
          body: { remarks: data.remarks },
        };
      },
      invalidatesTags: [
        "ReimbursementHistoryList",
        "ReimbursementApprovalList",
        "ReimbursementAdminList",
        "MyAnalytics",
        "ApprovalAnalytics",
      ],
    }),
    reRouteApprover: builder.mutation<
      unknown,
      IApproverToEdit & {
        new_approver_email: string;
      }
    >({
      query: (data) => {
        return {
          url: `/reimbursements/request/reroute/approver`,
          method: "PATCH",
          body: { ...data },
        };
      },
      invalidatesTags: [
        "ReimbursementRequest",
        "ReimbursementApprovalList",
        "MyAnalytics",
        "ApprovalAnalytics",
      ],
    }),
    transitionToCredited: builder.mutation<unknown, CreditPayload>({
      query: (data) => {
        return {
          url: `/reimbursements/request/credit`,
          method: "PATCH",
          body: { ...data },
        };
      },
      invalidatesTags: [
        "ReimbursementHistoryList",
        "ReimbursementRequest",
        "ReimbursementApprovalList",
        "MyAnalytics",
        "ApprovalAnalytics",
      ],
    }),
  }),
});

export const {
  useApproveReimbursementMutation,
  useRejectReimbursementMutation,
  useApproveReimbursementViaEmailMutation,
  useRejectReimbursementViaEmailMutation,
  useCancelReimbursementMutation,
  useHoldReimbursementMutation,
  useReRouteApproverMutation,
  useTransitionToCreditedMutation,
} = actionsApiSlice;
