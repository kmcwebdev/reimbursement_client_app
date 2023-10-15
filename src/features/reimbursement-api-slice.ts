import { appApiSlice } from "~/app/rtkQuery";
import {
  ExpenseTypeQuerySchema,
  type ExpenseTypeQueryType,
} from "~/schema/expense-type.schema";
import { type ReimbursementDetailsType } from "~/schema/reimbursement-details.schema";
import { type OnholdReimbursementType } from "~/schema/reimbursement-onhold-form.schema";
import { type RejectReimbursementType } from "~/schema/reimbursement-reject-form.schema";
import {
  type IFinanceAnalytics,
  type IHRBPAnalytics,
  type IManagerAnalytics,
  type IMemberAnalytics,
} from "~/types/dashboard-analytics.type";
import { type UploadFileResponse } from "~/types/file-upload-response.type";
import { type ReimbursementExpenseType } from "~/types/reimbursement.expense-type";
import { type ReimbursementRequestType } from "~/types/reimbursement.request-type";
import {
  type AuditLog,
  type IReimbursementsFilterQuery,
  type IStatus,
  type ReimbursementApproval,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";

export const reimbursementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ANALYTICS
    getMemberAnalytics: builder.query<IMemberAnalytics, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics/members",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "MemberAnalytics", id: JSON.stringify(query) },
      ],
    }),
    getHRBPAnalytics: builder.query<IHRBPAnalytics, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics/hrbp",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "HRBPAnalytics", id: JSON.stringify(query) },
      ],
    }),
    getManagerAnalytics: builder.query<IManagerAnalytics, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics/managers",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ManagerAnalytics", id: JSON.stringify(query) },
      ],
    }),
    getFinanceAnalytics: builder.query<IFinanceAnalytics, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics/finance",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "FinanceAnalytics", id: JSON.stringify(query) },
      ],
    }),
    // GET
    getAllRequests: builder.query<
      ReimbursementRequest[],
      IReimbursementsFilterQuery
    >({
      query: (query) => {
        const searchParams = createSearchParams(query);
        return {
          url: "/api/finance/reimbursements/requests",
          params:
            searchParams && searchParams.size ? searchParams.toString() : {},
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementRequestList", id: JSON.stringify(query) },
      ],
    }),
    getAllApproval: builder.query<
      ReimbursementApproval[],
      IReimbursementsFilterQuery
    >({
      query: (query) => {
        const searchParams = createSearchParams(query);
        return {
          url: "/api/finance/reimbursements/requests/for-approvals",
          params:
            searchParams && searchParams.size ? searchParams.toString() : {},
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementApprovalList", id: JSON.stringify(query) },
      ],
    }),
    getRequest: builder.query<
      ReimbursementRequest,
      Pick<ReimbursementRequest, "reimbursement_request_id">
    >({
      query: ({ reimbursement_request_id }) => {
        return {
          url: `/api/finance/reimbursements/requests/${reimbursement_request_id}`,
        };
      },
      keepUnusedDataFor: 0,
      providesTags: (
        _result,
        _fetchBaseQuery,
        { reimbursement_request_id },
      ) => [
        {
          type: "ReimbursementRequest",
          id: reimbursement_request_id,
        },
      ],
    }),
    requestTypes: builder.query<ReimbursementRequestType[], void>({
      query: () => "/api/finance/reimbursements/request-types",
    }),
    expenseTypes: builder.query<
      ReimbursementExpenseType[],
      ExpenseTypeQueryType
    >({
      query: ({ request_type_id }) => {
        const parse = ExpenseTypeQuerySchema.safeParse({ request_type_id });

        if (!parse.success) {
          throw new Error("Invalid request_type_id");
        }

        return {
          url: "/api/finance/reimbursements/expense-types",
          params: {
            request_type_id,
          },
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ExpenseTypes", id: query.request_type_id },
      ],
    }),
    allStatuses: builder.query<IStatus[], unknown>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/status",
        };
      },
      providesTags: (_result, _fetchBaseQuery, _query) => [
        { type: "AllStatuses", id: "/all" },
      ],
    }),
    allExpenseTypes: builder.query<ReimbursementExpenseType[], unknown>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/expense-types/all",
        };
      },
      providesTags: (_result, _fetchBaseQuery, _query) => [
        { type: "AllExpenseTypes", id: "/all" },
      ],
    }),
    auditLogs: builder.query<AuditLog[], { reimbursement_request_id: string }>({
      query: (query) => {
        return {
          url: "/api/finance/reimbursements/requests/auditlogs",
          params: query,
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "AuditLogs", id: query.reimbursement_request_id },
      ],
    }),

    //POST
    uploadFile: builder.mutation<UploadFileResponse, FormData>({
      query: (formData) => {
        return {
          url: "/api/finance/reimbursements/requests/attachments",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),
    createReimbursement: builder.mutation<
      unknown,
      Omit<ReimbursementDetailsType, "approvers"> & {
        approvers?: string[];
        attachment: string;
      }
    >({
      query: (data) => {
        return {
          url: "/api/finance/reimbursements/requests",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        { type: "ReimbursementRequestList" },
        { type: "MemberAnalytics" },
      ],
    }),
    approveReimbursement: builder.mutation<
      unknown,
      {
        approval_matrix_ids: string[];
      }
    >({
      query: (data) => {
        return {
          url: "/api/finance/reimbursement/requests/approve",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        { type: "ReimbursementApprovalList" },
        { type: "ManagerAnalytics" },
        { type: "HRBPAnalytics" },
        { type: "FinanceAnalytics" },
      ],
    }),
    rejectReimbursement: builder.mutation<
      unknown,
      RejectReimbursementType & { approval_matrix_id: string }
    >({
      query: (data) => {
        return {
          url: "/api/finance/reimbursement/requests/reject",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        { type: "ReimbursementApprovalList" },
        { type: "ManagerAnalytics" },
        { type: "HRBPAnalytics" },
        { type: "FinanceAnalytics" },
      ],
    }),
    approveReimbursementViaEmail: builder.mutation<{ message: string }, string>({
      query: (hash) => ({
        method: "POST",
        url: "/api/finance/reimbursement/requests/email-approval/approve",
        body: { hash },
      }),
    }),
    rejectReimbursementViaEmail: builder.mutation<{ message: string }, string>({
      query: (hash) => ({
        method: "POST",
        url: "/api/finance/reimbursement/requests/email-approval/reject",
        body: { hash },
      }),
    }),
    cancelReimbursement: builder.mutation<
      unknown,
      {
        reimbursement_request_id: string;
      }
    >({
      query: (data) => {
        return {
          url: "/api/finance/reimbursement/requests/cancel",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        { type: "ReimbursementRequestList" },
        { type: "MemberAnalytics" },
        { type: "ManagerAnalytics" },
        { type: "HRBPAnalytics" },
        { type: "FinanceAnalytics" },
      ],
    }),
    holdReimbursement: builder.mutation<
      unknown,
      OnholdReimbursementType & {
        reimbursement_request_id: string;
      }
    >({
      query: (data) => {
        return {
          url: "/api/finance/reimbursement/requests/onhold",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        { type: "ReimbursementApprovalList" },
        { type: "MemberAnalytics" },
        { type: "ManagerAnalytics" },
        { type: "HRBPAnalytics" },
        { type: "FinanceAnalytics" },
      ],
    }),

    //PATCH REQUESTS
    changeRole: builder.mutation<
      unknown,
      {
        org_id: string;
        role: string;
      }
    >({
      query: (data) => {
        return {
          url: "/api/auth/user/change-user-role-access-in-propelauth",
          method: "PATCH",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useGetMemberAnalyticsQuery,
  useGetHRBPAnalyticsQuery,
  useGetManagerAnalyticsQuery,
  useGetFinanceAnalyticsQuery,
  useGetAllRequestsQuery,
  useGetAllApprovalQuery,
  useGetRequestQuery,
  useRequestTypesQuery,
  useExpenseTypesQuery,
  useAllStatusesQuery,
  useAllExpenseTypesQuery,
  useAuditLogsQuery,
  useUploadFileMutation,
  useCreateReimbursementMutation,
  useApproveReimbursementMutation,
  useRejectReimbursementMutation,
  useHoldReimbursementMutation,
  useApproveReimbursementViaEmailMutation,
  useRejectReimbursementViaEmailMutation,
  useCancelReimbursementMutation,
  useChangeRoleMutation,
} = reimbursementApiSlice;
