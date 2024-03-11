import { appApiSlice } from "~/app/rtkQuery";
import {
  type FileStack,
  type ReimbursementFormValues,
} from "~/types/reimbursement.types";

/**
 * REIMBURSEMENT FORM API SLICE
 *
 * Endpoints dedicated for reimbursement form.
 */

export const reimbursementFormApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileStack, FormData>({
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
        "ReimbursementHistoryList",
        "MyRequests",
        "ReimbursementRequestList",
        "MyAnalytics",
      ],
    }),
  }),
});

export const { useUploadFileMutation, useCreateReimbursementMutation } =
  reimbursementFormApiSlice;
