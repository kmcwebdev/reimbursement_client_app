import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";

const NextAuthSessionProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthSessionProvider;
