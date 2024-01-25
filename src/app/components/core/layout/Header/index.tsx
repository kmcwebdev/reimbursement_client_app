import React from "react";
import PageTitle from "./PageTitle";
import ProfileMenu from "./ProfileMenu";

const Header: React.FC = () => {
  return (
    <div className="sticky top-0 z-20 flex h-16 flex-col justify-between border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4">
        <PageTitle />
        <ProfileMenu />
      </div>
    </div>
  );
};

export default Header;
