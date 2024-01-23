import { type EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { setAccessToken } from "~/features/state/user-state.slice";
import { env } from "../../env.mjs";
import { type RootState } from "./store";

type RefreshTokenResponse = {
  access: string;
};

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

export const refreshAccessToken = async (
  accessToken: string,
  refreshToken: string,
) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASEAPI_URL}/token/refresh`;

    const body = new URLSearchParams({
      refresh: refreshToken,
    });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body,
    });

    const refreshedTokens = (await response.json()) as RefreshTokenResponse;
    if (!response.ok) {
      throw refreshedTokens;
    }

    return refreshedTokens;
  } catch (error) {
    console.log("Refresh token error");
  }
};

const appApiBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  Record<string, never>,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await appApiBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const rootState = api.getState() as RootState;
    const refreshToken = rootState.session.refreshToken!;
    const accessToken = rootState.session.accessToken!;
    const newAccessToken = await refreshAccessToken(accessToken, refreshToken);

    if (newAccessToken?.access) {
      const { access } = newAccessToken;
      api.dispatch(setAccessToken(access));

      result = await appApiBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setAccessToken(null));
    }
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
    "ReimbursementAdminList",
    "ReimbursementHistoryList",
    "ReimbursementRequest",
    "MyAnalytics",
    "HRBPAnalytics",
    "ManagerAnalytics",
    "FinanceAnalytics",
    "ExpenseTypes",
    "AllExpenseTypes",
    "AllGroups",
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
