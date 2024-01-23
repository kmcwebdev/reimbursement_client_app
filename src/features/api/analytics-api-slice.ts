import { appApiSlice } from "~/app/rtkQuery";
import { type IAnalytics } from "~/types/dashboard-analytics.type";

/**
 * ANALYTICS API SLICE
 *
 * Dedicated analytics endpoints used for analytics cards.
 */

export const analyticsApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    myAnalytics: builder.query<IAnalytics, void>({
      query: () => {
        return {
          url: "/reimbursements/request/my-analytics",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "MyAnalytics", id: JSON.stringify(query) },
      ],
    }),
    approvalAnalytics: builder.query<IAnalytics, { type: string }>({
      query: (query) => {
        return {
          url: `/reimbursements/request/${query.type}/analytics`,
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ManagerAnalytics", id: JSON.stringify(query) },
      ],
    }),
  }),
});

export const { useMyAnalyticsQuery, useApprovalAnalyticsQuery } =
  analyticsApiSlice;
