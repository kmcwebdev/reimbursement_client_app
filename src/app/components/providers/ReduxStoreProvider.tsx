"use client";

import { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import store, { type AppStore } from "~/app/store";

const ReduxStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = store();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxStoreProvider;
