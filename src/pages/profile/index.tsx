import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import React, { Fragment } from "react";
import { type IconType } from "react-icons-all-files";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
import EmptyState from "~/components/core/EmptyState";

const Profile: React.FC = () => {
  return (
    <Fragment>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="grid h-72 w-full place-items-center rounded-md bg-white">
        <EmptyState
          title="Profile is empty"
          description="Wait.."
          icon={MdPerson as IconType}
        >
          <div className="bg-primary-normal h-10 w-32 rounded-md"></div>
        </EmptyState>
      </div>
    </Fragment>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromServerSideProps(context);

  if (!user) {
    return {
      redirect: {
        destination: "/api/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userJson: JSON.stringify(user),
    },
  };
};
