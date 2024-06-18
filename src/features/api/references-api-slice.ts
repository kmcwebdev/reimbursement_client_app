import { appApiSlice } from "~/app/rtkQuery";
import { reimbursementTypeSchema } from "~/schema/reimbursement-type.schema";
import {
  ClientFilterQuery,
  type ExpenseTypeResponse,
  type GroupResponse,
  type ReimbursementClientsResponse,
  type ReimbursementFormType,
  type RequestTypeResponse,
  type StatusResponse,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";

/**
 * REFERENCES API SLICE
 *
 * Dedicated endpoints for references.
 */

export const referencesApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestTypes: builder.query<RequestTypeResponse, void>({
      query: () => "/reimbursements/request/request-types",
    }),
    expenseTypes: builder.query<ExpenseTypeResponse, ReimbursementFormType>({
      query: ({ request_type }) => {
        const parse = reimbursementTypeSchema.safeParse({ request_type });

        if (!parse.success) {
          throw new Error("Invalid request_type_id");
        }

        return {
          url: "/reimbursements/request/expense-types",
          params: {
            request_type__id: request_type,
          },
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ExpenseTypes", id: query.request_type },
      ],
    }),
    allStatuses: builder.query<StatusResponse, unknown>({
      query: () => {
        return {
          url: "/reimbursements/request/request-status",
        };
      },
      providesTags: (_result, _fetchBaseQuery, _query) => [
        { type: "AllStatuses", id: "/all" },
      ],
    }),
    allExpenseTypes: builder.query<ExpenseTypeResponse, unknown>({
      query: () => {
        return {
          url: "/reimbursements/request/expense-types?page_size=100",
        };
      },
      providesTags: (_result, _fetchBaseQuery, _query) => [
        { type: "AllExpenseTypes", id: "/all" },
      ],
    }),
    allGroups: builder.query<GroupResponse, unknown>({
      query: () => {
        return {
          url: "/management/users/groups",
        };
      },
      providesTags: (_result, _fetchBaseQuery, _query) => [
        { type: "AllGroups", id: "/all" },
      ],
    }),
    allClients: builder.query<ReimbursementClientsResponse, ClientFilterQuery>({
      query: (query) => {
        const searchParams = createSearchParams(query);

        return {
          url: "/reimbursements/request/clients",
          params: searchParams ? searchParams : {},
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "AllClients", id: JSON.stringify(query) },
      ],
    }),
    allHRBPs: builder.query<any, unknown>({
      query: () => {
        return {
          url: "/management/users?group_id=4",
        };
      },
      providesTags: (_result, _fetchBaseQuery, _query) => [
        { type: "AllGroups", id: "/all" },
      ],
    }),
  }),
});

export const {
  useRequestTypesQuery,
  useExpenseTypesQuery,
  useAllStatusesQuery,
  useAllExpenseTypesQuery,
  useAllGroupsQuery,
  useAllClientsQuery,
  useAllHRBPsQuery,
} = referencesApiSlice;
