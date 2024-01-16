import { appApiSlice } from "~/app/rtkQuery";
import { type IRequestListResponse } from "~/types/reimbursement.types";
import { type IUser } from "../state/user-state.slice";

/**
 * USER API SLICE
 *
 * This endpoint provides access to user-specific data and features, offering exclusive * * functionality tailored to individual users.
 */

export const userApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<IUser, null>({
      query: () => {
        return {
          url: "/management/users/me",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "Me", id: JSON.stringify(query) },
      ],
    }),
    myRequests: builder.query<IRequestListResponse, void>({
      query: () => {
        return {
          url: "/reimbursements/request",
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
          url: `/management/users/group/${data.id}/assign`,
          method: "PATCH",
          body: { group_id: data.group_id },
        };
      },
    }),
  }),
});

export const { useGetMeQuery, useMyRequestsQuery, useAssignGroupMutation } =
  userApiSlice;
