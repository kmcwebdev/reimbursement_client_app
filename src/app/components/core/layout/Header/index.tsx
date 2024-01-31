import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../../Button";
import PageTitle from "./PageTitle";
import ProfileMenu from "./ProfileMenu";

const Header: React.FC = () => {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 flex h-16 flex-col justify-between border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4">
        <PageTitle />

        {session.status === "authenticated" && <ProfileMenu />}
        {session.status === "unauthenticated" && (
          <Button buttonType="text" onClick={() => router.push("/auth/login")}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
