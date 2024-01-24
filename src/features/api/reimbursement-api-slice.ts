import { appApiSlice } from "~/app/rtkQuery";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
  type IRequestListResponse,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";

export const reimbursementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApprovalList: builder.query<
      IRequestListResponse,
      IReimbursementsFilterQuery & { type: string }
    >({
      query: (query) => {
        const searchParams = createSearchParams(query);
        searchParams?.delete("type");
        searchParams?.append("ordering", "-created_at");
        return {
          url: `/reimbursements/request/${query.type}`,
          params: searchParams ? searchParams : {},
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementApprovalList", id: JSON.stringify(query) },
      ],
    }),

    getAdminList: builder.query<
      IRequestListResponse,
      IReimbursementsFilterQuery
    >({
      query: (query) => {
        const searchParams = createSearchParams(query);
        searchParams?.delete("type");
        searchParams?.append("ordering", "-created_at");
        return {
          url: `/reimbursements/request/administrator/all`,
          params: searchParams ? searchParams : {},
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementAdminList", id: JSON.stringify(query) },
      ],
    }),
    getRequestsHistory: builder.query<
      IRequestListResponse,
      IReimbursementsFilterQuery & { type: string }
    >({
      query: (query) => {
        let queries = query;
        if (queries.type === "finance" && !queries.request_status__id) {
          queries = { ...queries, request_status__id: "2,6" };
        }
        const searchParams = createSearchParams(queries);

        searchParams?.delete("type");
        searchParams?.append("ordering", "-created_at");
        return {
          url: `/reimbursements/request/${queries.type}/history`,
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
  }),
});

export const {
  useGetApprovalListQuery,
  useGetAdminListQuery,
  useGetRequestsHistoryQuery,
  useGetRequestQuery,
} = reimbursementApiSlice;
