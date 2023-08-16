import Head from "next/head";
import React from "react";
import { useUserAccessContext } from "~/context/AccessContext";
// const DashboardComp = dynamic(() => import("~/components/dashboard"), {
//   loading: () => <MdPerson className="animate-spin" />,
// });

const Dashboard: React.FC = () => {
  const { user } = useUserAccessContext();
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      {user?.role === "employee" && "Employee"}
      {user?.role === "manager" && "Manager"}
      {user?.role === "hrbp" && "Hrbp"}
      {user?.role === "finance" && "Finance"}
    </>
  );
};

export default Dashboard;
