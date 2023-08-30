import React, { useState, type PropsWithChildren, useEffect } from "react";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import { classNames } from "~/utils/classNames";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useUser } from "@propelauth/nextjs/client";
import dynamic from "next/dynamic";
import { useAppDispatch } from "~/app/hook";
import { setAccessToken, setUser } from "~/features/user-slice";

const AuthLoader = dynamic(() => import("~/components/loaders/AuthLoader"));

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { loading: userIsLoading, user, accessToken } = useUser();
  const dispatch = useAppDispatch();
  const [collapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (user && accessToken) {
      dispatch(
        setUser({
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          pictureUrl: user.pictureUrl,
          mfaEnabled: user.mfaEnabled,
          legacyUserId: user.legacyUserId,
          lastActiveAt: user.lastActiveAt,
          createdAt: user.createdAt,
        }),
      );
      dispatch(setAccessToken(accessToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, accessToken]);

  const toggleSidebarWidth = () => {
    setIsCollapsed(!collapsed);
  };

  if (userIsLoading) {
    return <AuthLoader />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} toggleSidebarWidth={toggleSidebarWidth} />

      <main
        className={classNames(
          collapsed
            ? "md:max-w-[calc(100vw_-_24px)]"
            : "md:max-w-[calc(100vw_-_101px)]",
          `${karla.variable} ${barlow_Condensed.variable} w-full flex-1 overflow-y-auto bg-white font-karla`,
        )}
      >
        <Header />
        <div className="relative flex h-[calc(100vh_-_4rem)] w-full flex-col">
          <div
            className={classNames(
              "relative h-full w-full overflow-hidden overflow-y-auto bg-white p-4",
            )}
          >
            {children}
          </div>

          <div className="absolute h-16" />
        </div>
      </main>
    </div>
  );
};

export default Layout;
