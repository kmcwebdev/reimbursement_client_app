import { appApiSlice } from "~/app/rtkQuery";
import {
  ExpenseTypeQuerySchema,
  type ExpenseTypeQueryType,
} from "~/schema/expense-type.schema";
import { type ReimbursementDetailsType } from "~/schema/reimbursement-details.schema";
import { type GetAllReimbursementRequestType } from "~/schema/reimbursement-query.schema";
import { type UploadFileResponse } from "~/types/file-upload-response.type";
import { type ReimbursementAnalyticsType } from "~/types/reimbursement-analytics";
import { type ReimbursementExpenseType } from "~/types/reimbursement.expese-type";
import { type ReimbursementRequestType } from "~/types/reimbursement.request-type";
import {
  type ReimbursementApproval,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";

export const reimbursementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<ReimbursementAnalyticsType, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementAnalytics", id: JSON.stringify(query) },
      ],
    }),
    getAllRequests: builder.query<
      ReimbursementRequest[],
      GetAllReimbursementRequestType
    >({
      query: (query) => {
        return {
          url: "/api/finance/reimbursements/requests",
          params: query,
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementRequestList", id: JSON.stringify(query) },
      ],
    }),
    getAllApproval: builder.query<
      ReimbursementApproval[],
      GetAllReimbursementRequestType
    >({
      query: (query) => {
        return {
          url: "/api/finance/reimbursements/requests/for-approvals",
          params: query,
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementApprovalList", id: JSON.stringify(query) },
      ],
    }),
    getRequest: builder.query<ReimbursementRequest, { id?: string }>({
      query: (query) => {
        return {
          url: `/api/finance/reimbursements/requests/${query.id}`,
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementRequest", id: JSON.stringify(query.id) },
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
        { type: "ExpenseTypes", id: JSON.stringify(query) },
      ],
    }),
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
        { type: "ReimbursementAnalytics" },
      ],
    }),
    approveReimbursement: builder.mutation<
      unknown,
      {
        matrixId: string;
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
        { type: "ReimbursementAnalytics" },
      ],
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetAllRequestsQuery,
  useGetAllApprovalQuery,
  useGetRequestQuery,
  useRequestTypesQuery,
  useExpenseTypesQuery,
  useUploadFileMutation,
  useCreateReimbursementMutation,
  useApproveReimbursementMutation,
} = reimbursementApiSlice;
