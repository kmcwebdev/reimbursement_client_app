import { appApiSlice } from "~/app/rtkQuery";
import {
  type IFileStack,
  type ReimbursementFormValues,
} from "~/types/reimbursement-form-values.type";

/**
 * REIMBURSEMENT FORM API SLICE
 *
 * Endpoints dedicated for reimbursement form.
 */

export const reimbursementFormApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<IFileStack, FormData>({
      query: (formData) => {
        return {
          url: "/reimbursements/request/attachments",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),
    createReimbursement: builder.mutation<unknown, ReimbursementFormValues>({
      query: (data) => {
        return {
          url: "/reimbursements/request",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        "MyRequests",
        "ReimbursementRequestList",
        "MyAnalytics",
      ],
    }),
  }),
});

export const { useUploadFileMutation, useCreateReimbursementMutation } =
  reimbursementFormApiSlice;
