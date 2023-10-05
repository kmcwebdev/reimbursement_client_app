import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps } from "next";
import React from "react";
import EmptyState from "~/components/core/EmptyState";

const NotFoundPage: React.FC = () => {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-72 w-full">
        <EmptyState
          title="Page Not Found."
          description={`The page doesn't exist.`}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;

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
