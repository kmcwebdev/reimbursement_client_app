import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";
import { auth } from "~/app/auth";

const NextAuthSessionProvider = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthSessionProvider;
