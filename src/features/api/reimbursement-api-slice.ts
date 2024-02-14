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
        const searchParams = createSearchParams(query);
        if (query.type !== "finance") {
          searchParams?.append(
            "approver_matrix__display_name",
            query.type === "hrbp" ? "HRBP" : "Manager",
          );

          if (query.request_status__id?.includes("2")) {
            const statusArray = query.request_status__id.split(",");
            searchParams?.delete("request_status__id");

            if (
              statusArray.includes("2") &&
              statusArray.filter((a) => a !== "2").length > 0
            ) {
              searchParams?.append(
                "request_status__id",
                statusArray.filter((a) => a !== "2").join(","),
              );
            }

            searchParams?.append("approver_matrix_is_approved", "True");
          }
        }
        searchParams?.delete("type");
        return {
          url: `/reimbursements/request/${query.type}/history`,
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
