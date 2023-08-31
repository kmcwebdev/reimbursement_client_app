import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type NextPage, type GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { Fragment } from "react";
import store from "~/app/store";
import { useUserAccessContext } from "~/context/AccessContext";
import { useRequestTypesQuery } from "~/features/reimbursement-api-slice";
import { setAccessToken } from "~/features/user-slice";

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

const Dashboard: NextPage<DashboardSSRProps> = () => {
  const { user } = useUserAccessContext();
  const {} = useRequestTypesQuery();

  // const propel = UserFromToken.fromJSON(props.userJson);

  return (
    <Fragment>
      <Head>
        <title>Dashboard</title>
      </Head>
      {user && user.role === "employee" && <EmployeeDashboard />}
      {user && user.role === "hrbp" && <HrbpDashboard />}
      {user && user.role === "finance" && <FinanceDashboard />}
      {user && user.role === "manager" && <ManagerDashboard />}
    </Fragment>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromServerSideProps(context);
  const accessToken = context.req.cookies?.__pa_at;

  store.dispatch(setAccessToken(accessToken as string));

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
