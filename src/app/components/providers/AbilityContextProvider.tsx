"use client";
import { signOut, useSession } from "next-auth/react";
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
  const { accessToken, assignedRole } = useAppSelector(
    (state) => state.session,
  );

  const {
    data: me,
    isLoading: meIsLoading,
    isError: meIsError,
  } = useGetMeQuery(null, {
    skip: !accessToken,
  });
  const dispatch = useAppDispatch();
  const [permissions, setPermissions] = useState<AppClaims[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * LOGIN PAGE REDIRECTION
   *
   * Redirects the user to the login page if unauthorized
   */
  useMemo(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== "undefined") {
      // Now it's safe to use location
      const { pathname } = window.location;

      // You can now safely use pathname in your logic
      // For example, if you need to redirect:
      if (
        !pathname.includes("/auth") &&
        nextAuthSession.status === "unauthenticated"
      ) {
        window.location.replace("/auth/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextAuthSession.status]);

  useMemo(() => {
    if (assignedRole && permissions) {
      setIsLoading(false);
    }
  }, [assignedRole, permissions]);

  useEffect(() => {
    if (
      nextAuthSession.status === "authenticated" &&
      nextAuthSession.data &&
      nextAuthSession.data.accessToken &&
      nextAuthSession.data.refreshToken
    ) {
      dispatch(setAccessToken(nextAuthSession.data.accessToken));
      dispatch(setRefreshToken(nextAuthSession.data.refreshToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextAuthSession]);

  void useMemo(async () => {
    if (me && !meIsLoading) {
      setTimeout(() => {
        if (!assignedRole && me.groups.length > 0) {
          dispatch(setAssignedRole(me.groups[0]));
        }
        setPermissions(me.permissions);
        dispatch(setUser(me));
      }, 0);
    }

    if (meIsError) {
      await signOut();
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, meIsLoading]);

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <AbilityContext.Provider value={defineAbility(assignedRole, permissions)}>
      {children}
    </AbilityContext.Provider>
  );
};
