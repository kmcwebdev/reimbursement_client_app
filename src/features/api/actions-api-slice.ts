import { appApiSlice } from "~/app/rtkQuery";
import { type OnholdReimbursementType } from "~/schema/reimbursement-onhold-form.schema";
import { type RejectReimbursementType } from "~/schema/reimbursement-reject-form.schema";
import { type IReimbursementRequest } from "~/types/reimbursement.types";

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
        { type: "ReimbursementApprovalList" },
        { type: "ApprovalAnalytics" },
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
        { type: "ReimbursementApprovalList" },
        { type: "ApprovalAnalytics" },
      ],
    }),
    approveReimbursementViaEmail: builder.mutation<{ message: string }, string>(
      {
        query: (hash) => ({
          method: "POST",
          url: "/api/finance/reimbursement/requests/email-approval/approve",
          body: { hash },
        }),
      },
    ),
    rejectReimbursementViaEmail: builder.mutation<{ message: string }, string>({
      query: (hash) => ({
        method: "PATCH",
        url: "/api/finance/reimbursement/requests/email-approval/reject",
        body: { hash },
      }),
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
        { type: "MyRequests" },
        { type: "ReimbursementRequestList" },
        { type: "MyAnalytics" },
        { type: "ApprovalAnalytics" },
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
        { type: "ReimbursementApprovalList" },
        { type: "MyAnalytics" },
        { type: "ApprovalAnalytics" },
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
} = actionsApiSlice;
