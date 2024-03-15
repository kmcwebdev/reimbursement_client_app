import { appApiSlice } from "~/app/rtkQuery";
import { type IPermissionsResponse } from "~/types/management.types";
import {
  type ReimbursementRequest,
  type UsersResponse,
} from "~/types/reimbursement.types";

/**
 * MANAGEMENT API SLICE
 *
 * This endpoint provides access to management data.
 */

export const managementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, null>({
      query: () => {
        return {
          url: "/management/users",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "Users", id: JSON.stringify(query) },
      ],
    }),
    getPermissions: builder.query<IPermissionsResponse, null>({
      query: () => {
        return {
          url: "/management/users/permissions",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "Permissions", id: JSON.stringify(query) },
      ],
    }),
    assignPermissions: builder.mutation<
      {
        group_id: 0;
        permission_name: "string";
      },
      Pick<ReimbursementRequest, "id">
    >({
      query: ({ id }) => {
        return {
          url: `/management/users/permissions/${id}`,
          method: "PATCH",
        };
      },

      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetPermissionsQuery,
  useAssignPermissionsMutation,
} = managementApiSlice;
