import { appApiSlice } from "~/app/rtkQuery";
import {
  type QueryFilter,
  type RequestListResponse,
  type User,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";

/**
 * USER API SLICE
 *
 * This endpoint provides access to user-specific data and features, offering exclusive * * functionality tailored to individual users.
 */

export const userApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, null>({
      query: () => {
        return {
          url: "/management/users/me",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "Me", id: JSON.stringify(query) },
      ],
    }),
    myRequests: builder.query<RequestListResponse, QueryFilter>({
      query: (query) => {
        const searchParams = createSearchParams(query);
        return {
          url: "/reimbursements/request",
          params: searchParams ? searchParams : undefined,
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "MyRequests", id: JSON.stringify(query) },
      ],
    }),

    //PATCH REQUESTS
    assignGroup: builder.mutation<
      unknown,
      {
        id: string;
        group_id: number;
      }
    >({
      query: (data) => {
        return {
          url: `/management/users/${data.id}/group/assign`,
          method: "PATCH",
          body: { group_id: data.group_id, replace_all: true },
        };
      },
    }),

    toggleAdminPrivilege: builder.mutation<
      unknown,
      {
        id: string;
        is_superuser: number;
      }
    >({
      query: (data) => {
        return {
          url: `/management/users/${data.id}/super-user-status`,
          method: "PATCH",
          body: { is_superuser: data.is_superuser },
        };
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useMyRequestsQuery,
  useAssignGroupMutation,
  useToggleAdminPrivilegeMutation,
} = userApiSlice;
