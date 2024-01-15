"use client";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
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
  setRefreshToken,
  setUser,
} from "~/features/state/user-state.slice";
import { type IGroupType } from "~/types/group.type";
import { type AppClaims } from "~/types/permission-types";
import { defineAbility } from "~/utils/define-ability";

const AuthLoader = dynamic(() => import("~/app/components/loaders/AuthLoader"));

export const AbilityContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const nextAuthSession = useSession();
  const pathname = usePathname();
  const { accessToken } = useAppSelector((state) => state.session);

  const router = useRouter();

  const { data: me, isLoading: meIsLoading } = useGetMeQuery(null, {
    skip: !accessToken,
  });
  const dispatch = useAppDispatch();
  const [permissions, setPermissions] = useState<AppClaims[]>();
  const [assignedRole, setAssignedRole] = useState<IGroupType>();

  /**
   * LOGIN PAGE REDIRECTION
   *
   * Redirects the user to the login page if unauthorized
   */
  useMemo(() => {
    if (nextAuthSession.status === "unauthenticated") {
      router.push("/auth/login");
    }

    if (
      pathname.includes("/auth") &&
      nextAuthSession.status === "authenticated"
    ) {
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextAuthSession.status, router]);

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

  useEffect(() => {
    if (me && !meIsLoading) {
      setAssignedRole(me.groups[0]);
      setPermissions(me.permissions);

      dispatch(setUser(me));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, meIsLoading]);

  if (meIsLoading) {
    return <AuthLoader />;
  }

  return (
    <AbilityContext.Provider value={defineAbility(assignedRole, permissions)}>
      {children}
    </AbilityContext.Provider>
  );
};
