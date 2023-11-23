"use client";

import { type ReactNode } from "react";
import { Provider } from "react-redux";
import store from "~/app/store";

const ReduxStoreProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxStoreProvider;
