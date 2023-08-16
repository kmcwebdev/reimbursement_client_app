import React, {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

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
];

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type IRole = "employee" | "manager" | "hrbp" | "finance" | string;

export interface IUserData {
  name: string;
  role: IRole;
}

interface IUserAccessCtx {
  handleLogout: () => Promise<void>;
  user: IUserData | null;
  changeUser: (role: IRole) => void;
}

const UserAccessContext = createContext<IUserAccessCtx>({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleLogout: async () => console.log("logged out"),
  user: users[0],
  changeUser: () => console.log("changed user"),
});

export const useUserAccessContext = () => {
  return useContext(UserAccessContext);
};

export const UserAccessProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<IUserData | null>(users[0]);
  // const [isAuthenticated, setIsAuthenticated] = useState(true);

  // const login = (userData: IUserData) => {
  //   // Implement login logic, set user and isAuthenticated
  //   setUser(userData);
  //   setIsAuthenticated(true);
  // };

  const changeUser = (role: IRole) => {
    const u = users.find((a) => a.role === role);

    if (u) {
      setUser(u);
    }
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const logout = async () => {
    // Implement logout logic, clear user and isAuthenticated
    setUser(users[0]);
    // setIsAuthenticated(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <UserAccessContext.Provider value={{ handleLogout, user, changeUser }}>
      {children}
    </UserAccessContext.Provider>
  );
};
