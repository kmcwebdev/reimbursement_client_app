"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useMemo(() => {
    if (typeof window !== "undefined") {
      const isInitialLogin = localStorage.getItem("alreadyLoggedIn");

      if (isInitialLogin) {
        const parsedValue = JSON.parse(isInitialLogin) as boolean;
        setLoggedIn(parsedValue);
      }
    }
  }, []);

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

  useEffect(() => {
    if (pathname) {
      if (
        !pathname.includes("/auth") &&
        nextAuthSession.status === "authenticated"
      ) {
        setIsLoading(false);
      }

      if (
        !pathname.includes("/auth") &&
        nextAuthSession.status === "unauthenticated"
      ) {
        router.push("/auth/login");
      }

      if (
        pathname.includes("/auth") &&
        nextAuthSession.status === "unauthenticated"
      ) {
        setIsLoading(false);
      }

      if (
        pathname.includes("/auth") &&
        nextAuthSession.status === "authenticated"
      ) {
        if (typeof window !== "undefined") {
          const alreadyLoggedIn = localStorage.getItem("alreadyLoggedIn");

          if (alreadyLoggedIn === "true") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        }
      }
    }
  }, [nextAuthSession.status, pathname, router]);

  useEffect(() => {
    if (
      pathname === "/" &&
      nextAuthSession.status === "authenticated" &&
      loggedIn
    ) {
      setIsLoading(true);
      router.push("/dashboard");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, router]);

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

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <AbilityContext.Provider value={defineAbility(assignedRole, permissions)}>
      {children}
    </AbilityContext.Provider>
  );
};
