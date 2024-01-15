import { appApiSlice } from "~/app/rtkQuery";
import {
  type IFinanceAnalytics,
  type IHRBPAnalytics,
  type IManagerAnalytics,
  type IMemberAnalytics,
} from "~/types/dashboard-analytics.type";

/**
 * ANALYTICS API SLICE
 *
 * Dedicated analytics endpoints used for analytics cards.
 */

export const analyticsApiSlice = appApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    memberAnalytics: builder.query<IMemberAnalytics, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics/members",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "MemberAnalytics", id: JSON.stringify(query) },
      ],
    }),
    hrbpAnalytics: builder.query<IHRBPAnalytics, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics/hrbp",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "HRBPAnalytics", id: JSON.stringify(query) },
      ],
    }),
    managerAnalytics: builder.query<IManagerAnalytics, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics/managers",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "ManagerAnalytics", id: JSON.stringify(query) },
      ],
    }),
    financeAnalytics: builder.query<IFinanceAnalytics, void>({
      query: () => {
        return {
          url: "/api/finance/reimbursements/requests/dashboard/analytics/finance",
        };
      },
      providesTags: (_result, _fetchBaseQuery, query) => [
        { type: "FinanceAnalytics", id: JSON.stringify(query) },
      ],
    }),
  }),
});

export const {
  useMemberAnalyticsQuery,
  useHrbpAnalyticsQuery,
  useManagerAnalyticsQuery,
  useFinanceAnalyticsQuery,
} = analyticsApiSlice;
