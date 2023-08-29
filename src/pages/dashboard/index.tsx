import { UserFromToken, useLogoutFunction } from "@propelauth/nextjs/client";
import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type NextPage, type GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { useUserAccessContext } from "~/context/AccessContext";

interface DashboardSSRProps {
  userJson: string;
}

const EmployeeDashboard = dynamic(
  () => import("~/components/dashboard/employee"),
);
const FinanceDashboard = dynamic(
  () => import("~/components/dashboard/Finance"),
);
const HrbpDashboard = dynamic(() => import("~/components/dashboard/Hrbp"));
const ManagerDashboard = dynamic(
  () => import("~/components/dashboard/Manager"),
);

const Dashboard: NextPage<DashboardSSRProps> = (props) => {
  const { user } = useUserAccessContext();
  const logoutFn = useLogoutFunction();

  const propel = UserFromToken.fromJSON(props.userJson);

  console.log(propel);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      {user && user.role === "employee" && <EmployeeDashboard />}
      {user && user.role === "hrbp" && <HrbpDashboard />}
      {user && user.role === "finance" && <FinanceDashboard />}
      {user && user.role === "manager" && <ManagerDashboard />}

      <button onClick={() => void logoutFn()}>Logout</button>
    </>
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
