import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
import DashboardComponent from "~/components/dashboard";

interface SSRProps {
  userJson: string;
}

const Dashboard: NextPage<SSRProps> = () => {
  return (
    <Fragment>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardComponent />
    </Fragment>
  );
};

export default Dashboard;

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
