import { appApiSlice } from "~/app/rtkQuery";
import {
  ExpenseTypeQuerySchema,
  type ExpenseTypeQueryType,
} from "~/schema/expense-type.schema";
import { type ReimbursementDetailsType } from "~/schema/reimbursement-details.schema";
import { type GetAllReimbursementRequestType } from "~/schema/reimbursement-query.schema";
import { type UploadFileResponse } from "~/types/file-upload-response.type";
import { type ReimbursementExpenseType } from "~/types/reimbursement.expese-type";
import { type ReimbursementRequestType } from "~/types/reimbursement.request-type";
import { type ReimbursementRequest } from "~/types/reimbursement.types";

export const reimbursementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRequests: builder.query<
      ReimbursementRequest[],
      GetAllReimbursementRequestType
    >({
      query: (query) => {
        return {
          url: "/api/finance/reimbursements/requests",
          params: query,
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ReimbursementRequestList", id: JSON.stringify(query) },
      ],
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
