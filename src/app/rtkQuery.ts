import { type EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { env } from "../../env.mjs";
import { type RootState } from "./store";

const appApiBaseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_BASEAPI_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).session.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const appApiBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  Record<string, never>,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await appApiBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // const rootState = api.getState() as RootState;

    // const propelauthRefreshTokenQuery = await propelauthUserInfo();

    // if (propelauthRefreshTokenQuery?.accessToken) {
    //   // const user = rootState.user;
    //   const { accessToken } = propelauthRefreshTokenQuery;

    //   api.dispatch(setAccessToken(accessToken));

    result = await appApiBaseQuery(args, api, extraOptions);
    // } else {
    //   api.dispatch(clearAccessToken());
    // }
  }

  return result;
};

export const appApiSlice = createApi({
  reducerPath: "appApi",
  baseQuery: appApiBaseQueryWithReauth,
  tagTypes: [
    "Me",
    "MyRequests",
    "ReimbursementRequestList",
    "ReimbursementApprovalList",
    "ReimbursementRequest",
    "MemberAnalytics",
    "HRBPAnalytics",
    "ManagerAnalytics",
    "FinanceAnalytics",
    "ExpenseTypes",
    "AllExpenseTypes",
    "AllStatuses",
    "AuditLogs",
    "Users",
    "Permissions",
    "AssignPermissions",
  ],
  endpoints: (
    _builder: EndpointBuilder<
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      "appApi"
    >,
  ) => ({}),
});
