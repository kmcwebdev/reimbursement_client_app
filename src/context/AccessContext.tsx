import { useUser } from "@propelauth/nextjs/client";
import dynamic from "next/dynamic";
import React, {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

const AuthLoader = dynamic(() => import("~/components/loaders/AuthLoader"));

const users: IUserData[] = [
  {
    name: "hrbp",
    role: "hrbp",
  },
  {
    name: "employee",
    role: "employee",
  },
  {
    name: "manager",
    role: "manager",
  },
  {
    name: "finance",
    role: "finance",
  },
  {
    name: "sample",
    role: "sample",
  },
];

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type IRole = "employee" | "manager" | "hrbp" | "finance" | "sample";

export interface IUserData {
  name: string;
  role: IRole;
}

interface IUserAccessCtx {
  user: IUserData | null;
  changeUser: (role: IRole) => void;
}

const UserAccessContext = createContext<IUserAccessCtx>({
  user: users[0],
  changeUser: () => console.log("changed user"),
});

export const UserAccessProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { loading } = useUser();
  const [user, setUser] = useState<IUserData | null>(users[0]);

  const changeUser = (role: IRole) => {
    const u = users.find((a) => a.role === role);

    if (u) {
      setUser(u);
    }
  };

  if (loading) {
    return <AuthLoader />;
  }

  return (
    <UserAccessContext.Provider value={{ user, changeUser }}>
      {children}
    </UserAccessContext.Provider>
  );
};

export const useUserAccessContext = () => {
  return useContext(UserAccessContext);
};
