import { z } from "zod";
import { appApiSlice } from "~/app/rtkQuery";
import { type ReimbursementDetailsSchema } from "~/schema/reimbursement-details.schema";
import { type UploadFileResponse } from "~/types/file-upload-response.type";
import { type ReimbursementExpenseType } from "~/types/reimbursement.expese-type";
import { type ReimbursementRequestType } from "~/types/reimbursement.request-type";
import { type ReimbursementRequest } from "~/types/reimbursement.types";

const ExpenseTypeQuerySchema = z.object({
  request_type_id: z.string().uuid(),
});

type ExpenseTypeQueryType = z.infer<typeof ExpenseTypeQuerySchema>;

export type ReimbursementDetailsType = z.infer<
  typeof ReimbursementDetailsSchema
>;

export const reimbursementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRequests: builder.query<ReimbursementRequest[], void>({
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
    uploadFile: builder.mutation<UploadFileResponse, FormData>({
      query: (formData) => {
        return {
          url: "/api/finance/reimbursements/requests/attachments",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),
    createReimbursement: builder.mutation<
      unknown,
      ReimbursementDetailsType & { attachment: string }
    >({
      query: (data) => {
        return {
          url: "/api/finance/reimbursements/requests",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useGetAllRequestsQuery,
  useRequestTypesQuery,
  useExpenseTypesQuery,
  useUploadFileMutation,
  useCreateReimbursementMutation,
} = reimbursementApiSlice;
