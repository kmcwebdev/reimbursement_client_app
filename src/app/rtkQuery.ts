import { type EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { clearAccessToken, setAccessToken } from "~/features/user-slice";
import { propelauthRefreshToken } from "~/utils/propelauthRefreshToken";
import { type RootState } from "./store";
import { env } from "~/env.mjs";

const appApiBaseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const userState = getState() as RootState;

    if (userState.user.accessToken) {
      headers.set("authorization", `Bearer ${userState.user.accessToken}`);
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

    const propelauthRefreshTokenQuery = await propelauthRefreshToken();

    if (propelauthRefreshTokenQuery?.access_token) {
      // const user = rootState.user;
      const accessToken = propelauthRefreshTokenQuery.access_token;

      api.dispatch(setAccessToken(accessToken));

      result = await appApiBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAccessToken());
    }
  }

  return result;
};

export const appApiSlice = createApi({
  reducerPath: "appApi",
  baseQuery: appApiBaseQueryWithReauth,
  tagTypes: ["PandadocAccessCredentials", "PandadocDocumentList"],
  endpoints: (
    _builder: EndpointBuilder<
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      "appApi"
    >,
  ) => ({}),
});
