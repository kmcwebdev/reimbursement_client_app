import { appApiSlice } from "~/app/rtkQuery";
import { type IMyRequestResponseType } from "~/types/reimbursement.types";
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
    myRequests: builder.query<IMyRequestResponseType, void>({
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

export const { useGetMeQuery, useMyRequestsQuery, useChangeRoleMutation } =
  userApiSlice;
