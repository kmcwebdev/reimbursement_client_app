import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import EmptyState from "~/components/core/EmptyState";

const ForbiddenPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Forbidden</title>
      </Head>
      <div className="grid h-full w-full place-items-center">
        <div className="h-72 w-full">
          <EmptyState
            title="Forbidden."
            description="You do not have permission to access this page."
          />
        </div>
      </div>
    </>
  );
};

export default ForbiddenPage;

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
