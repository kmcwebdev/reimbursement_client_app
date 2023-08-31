import { z } from "zod";
import { appApiSlice } from "~/app/rtkQuery";
import { type ReimbursementExpenseType } from "~/types/reimbursement.expese-type";
import { type ReimbursementRequestType } from "~/types/reimbursement.request-type";

const ExpenseTypeQuerySchema = z.object({
  request_type_id: z.string().uuid(),
});

type ExpenseTypeQueryType = z.infer<typeof ExpenseTypeQuerySchema>;

export const reimbursementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRequests: builder.query<unknown, void>({
      query: () => "/api/finance/reimbursements/requests",
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
    }),
  }),
});

export const {
  useGetAllRequestsQuery,
  useRequestTypesQuery,
  useExpenseTypesQuery,
} = reimbursementApiSlice;
