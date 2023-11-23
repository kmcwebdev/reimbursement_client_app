"use client";
import { useUser } from "@propelauth/nextjs/client";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type PropsWithChildren } from "react";
import { useAppDispatch } from "~/app/hook";
import { AbilityContext } from "~/context/AbilityContext";
import { setUser as reduxSetUser, setAccessToken } from "~/features/user-slice";
import { type AppClaims } from "~/types/permission-types";
import { defineAbility } from "~/utils/define-ability";

const AuthLoader = dynamic(() => import("~/app/components/loaders/AuthLoader"));

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type IRole =
  | "Member"
  | "External Reimbursement Approver Manager"
  | "HRBP"
  | "Finance";

export const AbilityContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const [permissions, setPermissions] = useState<AppClaims[]>();
  const [assignedRole, setAssignedRole] = useState<IRole>();

  const { loading: userIsLoading, user: propelauth, accessToken } = useUser();
  useEffect(() => {
    if (propelauth && accessToken) {
      const {
        userId,
        email,
        firstName,
        lastName,
        username,
        pictureUrl,
        mfaEnabled,
        legacyUserId,
        lastActiveAt,
        createdAt,
      } = propelauth;

      const org = propelauth.getOrgs();

      if (!org.length) {
        throw new Error("User does not belong to any off the organization");
      }

      const assignedRole = org[0].assignedRole;

      setAssignedRole(assignedRole as IRole);

      const permissions = org[0].permissions;

      const transformedPermissions: AppClaims[] = [];

      if (permissions && permissions.length > 0) {
        permissions.forEach((permission) => {
          const sliced = permission.split("::");
          transformedPermissions.push(sliced[1].toUpperCase() as AppClaims);
        });
      }

      setPermissions(transformedPermissions);

      dispatch(
        reduxSetUser({
          userId,
          email,
          firstName,
          lastName,
          username,
          orgId: org[0].orgId,
          orgName: org[0].orgName,
          assignedRole,
          pictureUrl,
          mfaEnabled,
          legacyUserId,
          lastActiveAt,
          createdAt,
          permissions: transformedPermissions,
        }),
      );

      dispatch(setAccessToken(accessToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propelauth, accessToken]);

  if (userIsLoading) {
    return <AuthLoader />;
  }

  return (
    <AbilityContext.Provider value={defineAbility(assignedRole, permissions)}>
      {children}
    </AbilityContext.Provider>
  );
};
