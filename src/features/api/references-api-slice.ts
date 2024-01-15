import { appApiSlice } from "~/app/rtkQuery";
import {
  ReimbursementTypeSchema,
  type ReimbursementFormType,
} from "~/schema/reimbursement-type.schema";
import { type IExpenseTypeResponse } from "~/types/reimbursement.expense-type";
import { type ReimbursementRequestType } from "~/types/reimbursement.request-type";
import { type IStatus } from "~/types/reimbursement.types";

/**
 * REFERENCES API SLICE
 *
 * Dedicated endpoints for references.
 */

export const referencesApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestTypes: builder.query<ReimbursementRequestType[], void>({
      query: () => "/reimbursements/request/request-types",
    }),
    expenseTypes: builder.query<IExpenseTypeResponse, ReimbursementFormType>({
      query: ({ request_type }) => {
        const parse = ReimbursementTypeSchema.safeParse({ request_type });

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
    allStatuses: builder.query<IStatus[], unknown>({
      query: () => {
        return {
          url: "/reimbursements/request/request-status",
        };
      },
      providesTags: (_result, _fetchBaseQuery, _query) => [
        { type: "AllStatuses", id: "/all" },
      ],
    }),
    allExpenseTypes: builder.query<IExpenseTypeResponse, unknown>({
      query: () => {
        return {
          url: "/reimbursements/request/expense-types?page_size=100",
        };
      },
      providesTags: (_result, _fetchBaseQuery, _query) => [
        { type: "AllExpenseTypes", id: "/all" },
      ],
    }),
  }),
});

export const {
  useRequestTypesQuery,
  useExpenseTypesQuery,
  useAllStatusesQuery,
  useAllExpenseTypesQuery,
} = referencesApiSlice;
