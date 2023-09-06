import { useUser } from "@propelauth/nextjs/client";
import dynamic from "next/dynamic";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useAppDispatch } from "~/app/hook";
import { setUser as reduxSetUser, setAccessToken } from "~/features/user-slice";
import { type AppClaims } from "~/types/permission-types";
import { ORG_KMC_SOLUTIONS } from "~/utils/constant";
import { defineAbility } from "~/utils/define-ability";
import { AbilityContext } from "./AbilityContext";

const AuthLoader = dynamic(() => import("~/components/loaders/AuthLoader"));

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type IRole =
  | "Member"
  | "External Reimbursement Approver Manager"
  | "HRBP"
  | "Finance";

export interface IUserData {
  name: string;
  role: IRole;
}

interface IUserAccessCtx {
  changeUser: (role: IRole) => void;
}

const UserContext = createContext<IUserAccessCtx>({
  changeUser: () => console.log("changed user"),
});

export const UserAccessProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { loading: userIsLoading, user: propelauth, accessToken } = useUser();
  const [permissions, setPermissions] = useState<AppClaims[]>();

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

      const org = propelauth.getOrgByName(ORG_KMC_SOLUTIONS);

      if (!org) {
        throw new Error("User does not belong to any off the organization");
      }

      const assignedRole = org.assignedRole;

      const permissions = org.permissions;

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
  }, [propelauth, accessToken, dispatch]);

  if (userIsLoading) {
    return <AuthLoader />;
  }

  return (
    <AbilityContext.Provider value={defineAbility(permissions)}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
