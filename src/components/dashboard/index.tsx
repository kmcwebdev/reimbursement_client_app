import Head from "next/head";
import React from "react";
import { useAppSelector } from "~/app/hook";
import PageAnimation from "../animation/PageAnimation";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import MemberDashboard from "./Member";

const DashboardComponent: React.FC = () => {
  const { user } = useAppSelector((state) => state.session);
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <PageAnimation>
        {user && (
          <>
            {user.assignedRole ===
              "External Reimbursement Approver Manager" && <ManagerDashboard />}
            {user.assignedRole === "Member" && <MemberDashboard />}
            {user.assignedRole === "HRBP" && <HrbpDashboard />}
            {user.assignedRole === "Finance" && <FinanceDashboard />}
          </>
        )}
      </PageAnimation>
    </>
  );
};

export default DashboardComponent;
