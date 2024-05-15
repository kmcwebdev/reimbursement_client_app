import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type EndpointBuilder,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { signOut } from "next-auth/react";
import { clearUserSession, setAccessToken } from "~/features/state/user-state.slice";
import { env } from "../../env.mjs";
import { type RootState } from "./store";

type RefreshTokenResponse = {
  access: string;
};

const unprotectedEndpoints = [
  "approveReimbursementViaEmail",
  "rejectReimbursementViaEmail",
  "changePassword",
  "forgotPassword",
];

const appApiBaseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_BASEAPI_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Cache-Control", "no-cache");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    const token = (getState() as RootState).session.accessToken;

    if (token && !headers.has("authorization")) {
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
    console.log("Failed to refresh token");
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

  const isProtectedEndpoint = unprotectedEndpoints.some(
    (prefix) => api.endpoint === prefix,
  );

  if (result?.error?.status === 401 && !isProtectedEndpoint) {
    const rootState = api.getState() as RootState;
    const refreshToken = rootState.session.refreshToken!;
    const accessToken = rootState.session.accessToken!;
    const newAccessToken = await refreshAccessToken(accessToken, refreshToken);


    if (newAccessToken?.access) {
      const { access } = newAccessToken;
      api.dispatch(setAccessToken(access));

      result = await appApiBaseQuery(args, api, extraOptions);
    } else {
      await signOut().then(() => {
      api.dispatch(clearUserSession());
      window.location.reload();
    });
    }
  }

  if (
    result?.error?.status === 500 &&
    !window.location.pathname.includes("server-error")
  ) {
    window.location.replace("/server-error");
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
    "ApprovalAnalytics",
    "ExpenseTypes",
    "AllExpenseTypes",
    "AllGroups",
    "AllStatuses",
    "Users",
    "Permissions",
    "AssignPermissions",
    "DownloadReports",
  ],
  endpoints: (
    _builder: EndpointBuilder<
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      "appApi"
    >,
  ) => ({}),
});
