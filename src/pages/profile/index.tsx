import Head from "next/head";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import EmptyState from "~/components/core/EmptyState";

const Profile: React.FC = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="grid h-72 w-full place-items-center rounded-md bg-white">
        <EmptyState
          title="Profile is empty"
          description="Wala pa kasing nagagawa na hayop ka! Magcode ka"
          icon={MdPerson as IconType}
        >
          <div className="bg-primary-normal h-10 w-32 rounded-md"></div>
        </EmptyState>
      </div>
    </>
  );
};

export default Profile;
