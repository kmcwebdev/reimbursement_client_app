import { configureStore } from "@reduxjs/toolkit";
import testReducer from "../features/test-slice";
import userReducer from "../features/user-slice";
import { appApiSlice } from "./api";
import { env } from "~/env.mjs";

const store = configureStore({
  reducer: {
    [appApiSlice.reducerPath]: appApiSlice.reducer,
    user: userReducer,
    test: testReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(appApiSlice.middleware),
  devTools: env.NEXT_PUBLIC_ENVIRONMENT === "development",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;