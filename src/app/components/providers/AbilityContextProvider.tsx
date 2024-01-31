"use client";
import { useSession } from "next-auth/react";
import React, {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { AbilityContext } from "~/context/AbilityContext";
import { useGetMeQuery } from "~/features/api/user-api-slice";
import {
  setAccessToken,
  setAssignedRole,
  setRefreshToken,
  setUser,
} from "~/features/state/user-state.slice";
import { type AppClaims } from "~/types/permission-types";
import { defineAbility } from "~/utils/define-ability";
import AuthLoader from "../loaders/AuthLoader";

export const AbilityContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const nextAuthSession = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { accessToken, assignedRole } = useAppSelector(
    (state) => state.session,
  );
  const { data: me, isLoading: meIsLoading } = useGetMeQuery(null, {
    skip: !accessToken,
  });
  const dispatch = useAppDispatch();
  const [permissions, setPermissions] = useState<AppClaims[]>();

  const dispatchTokens = (access: string, refresh: string) => {
    dispatch(setAccessToken(access));
    dispatch(setRefreshToken(refresh));
  };

  /**STORES TOKEN IN REDUX */
  useEffect(() => {
    if (
      nextAuthSession &&
      nextAuthSession.data &&
      nextAuthSession.data.accessToken &&
      nextAuthSession.data.refreshToken
    ) {
      dispatchTokens(
        nextAuthSession.data.accessToken,
        nextAuthSession.data.refreshToken,
      );
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextAuthSession]);

  useMemo(() => {
    if (me && !meIsLoading) {
      setTimeout(() => {
        if (!assignedRole && me.groups.length > 0) {
          dispatch(setAssignedRole(me.groups[0]));
        }
        setPermissions(me.permissions);
        dispatch(setUser(me));
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, meIsLoading]);

  if (isLoading && nextAuthSession.status === "loading") {
    return <AuthLoader />;
  }

  return (
    <AbilityContext.Provider value={defineAbility(assignedRole, permissions)}>
      {children}
    </AbilityContext.Provider>
  );
};
