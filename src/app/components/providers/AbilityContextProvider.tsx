"use client";
import { redirect, usePathname } from "next/navigation";
import React, {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import UserApiService from "~/app/api/services/user-service";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { AbilityContext } from "~/context/AbilityContext";
import {
  setAccessToken,
  setAssignedRole,
  setRefreshToken,
  setUser,
} from "~/features/state/user-state.slice";
import { useCurrentSession } from "~/hooks/use-current-session";
import { type AppClaims } from "~/types/reimbursement.types";
import { defineAbility } from "~/utils/define-ability";
import AuthLoader from "../loaders/AuthLoader";

export const AbilityContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // const nextAuthSession = useSession();
  const nextAuthCurrentSession = useCurrentSession();
  const pathname = usePathname();

  const { accessToken, assignedRole } = useAppSelector(
    (state) => state.session,
  );
  const { data: me, isFetching: meIsLoading } =
    UserApiService.useMe(accessToken);
  const dispatch = useAppDispatch();
  const [permissions, setPermissions] = useState<AppClaims[]>();

  const dispatchTokens = (access: string, refresh: string) => {
    dispatch(setAccessToken(access));
    dispatch(setRefreshToken(refresh));
  };

  /**STORES TOKEN IN REDUX AND LOCAL STORAGE */
  useEffect(() => {
    if (
      nextAuthCurrentSession.data &&
      nextAuthCurrentSession.data.accessToken &&
      nextAuthCurrentSession.data.refreshToken
    ) {
      localStorage.setItem(
        "_user_session",
        JSON.stringify(nextAuthCurrentSession.data),
      );

      dispatchTokens(
        nextAuthCurrentSession.data.accessToken,
        nextAuthCurrentSession.data.refreshToken,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextAuthCurrentSession]);

  useMemo(() => {
    if (me && !meIsLoading) {
      console.log("Triggered me useEffect");
      if (me && me.profile && me.profile.first_login && pathname !== "/") {
        redirect("/");
      }

      if (!assignedRole && me.groups.length > 0) {
        dispatch(setAssignedRole(me.groups[0]));
      }
      setPermissions(me.permissions);
      dispatch(setUser(me));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, meIsLoading]);

  if (nextAuthCurrentSession.status === "loading" && meIsLoading) {
    return <AuthLoader />;
  }

  return (
    <AbilityContext.Provider value={defineAbility(assignedRole, permissions)}>
      {children}
    </AbilityContext.Provider>
  );
};
