import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import { MdPerson } from "react-icons-all-files/md/MdPerson";
const DashboardComp = dynamic(() => import("~/components/dashboard"), {
  loading: () => <MdPerson className="animate-spin" />,
});

const Dashboard: React.FC = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardComp />
    </>
  );
};

export default Dashboard;
