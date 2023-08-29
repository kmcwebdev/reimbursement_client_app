import { appApiSlice } from "~/app/rtkQuery";

export const reimbursementApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAll: builder.query({
      query: () => "/reimbursements",
    }),
  }),
});

export const {} = reimbursementApiSlice;
