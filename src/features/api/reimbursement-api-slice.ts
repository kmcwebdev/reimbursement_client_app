import { appApiSlice } from "~/app/rtkQuery";
import {
  type AuditLog,
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
  type IRequestListResponse,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";

export const reimbursementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET
    getAllRequests: builder.query<
      IReimbursementRequest[],
      Partial<IReimbursementsFilterQuery>
    >({
      query: (query) => {
        const searchParams = createSearchParams(query);
        return {
          url: "/api/finance/reimbursements/requests",
          data: searchParams,
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementRequestList", id: JSON.stringify(query) },
      ],
    }),
    getAllApproval: builder.query<
      IRequestListResponse,
      IReimbursementsFilterQuery
    >({
      query: (query) => {
        const searchParams = createSearchParams(query);
        return {
          url: "/reimbursements/request/manager",
          params:
            searchParams && searchParams.size ? searchParams.toString() : {},
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementApprovalList", id: JSON.stringify(query) },
      ],
    }),
    getRequestsHistory: builder.query<
      IRequestListResponse,
      IReimbursementsFilterQuery
    >({
      query: (query) => {
        const searchParams = createSearchParams(query);
        return {
          url: "/reimbursements/request/history",
          params:
            searchParams && searchParams.size ? searchParams.toString() : {},
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementHistoryList", id: JSON.stringify(query) },
      ],
    }),
    getRequest: builder.query<
      IReimbursementRequest,
      Pick<IReimbursementRequest, "id">
    >({
      query: ({ id }) => {
        return {
          url: `/reimbursements/request/${id}`,
        };
      },
      keepUnusedDataFor: 0,
      providesTags: (_result, _fetchBaseQuery, { id }) => [
        {
          type: "ReimbursementRequest",
          id,
        },
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
  }),
});

export const {
  useGetAllRequestsQuery,
  useGetAllApprovalQuery,
  useGetRequestsHistoryQuery,
  useGetRequestQuery,
  useAuditLogsQuery,
} = reimbursementApiSlice;
