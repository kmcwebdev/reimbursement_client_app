import React from "react";
import PageTitle from "./PageTitle";
import ProfileMenu from "./ProfileMenu";

interface indexProps {}

const Header: React.FC<indexProps> = () => {
  return (
    <div className="sticky top-0 z-[1000] flex h-16 flex-col justify-between border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <PageTitle />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
