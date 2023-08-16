import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const DashboardComponent = dynamic(() => import("~/components/dashboard"));

const Dashboard: React.FC = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <DashboardComponent />
    </>
  );
};

export default Dashboard;
