import Head from "next/head";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import EmptyState from "~/components/core/EmptyState";

const Reimbursements: React.FC = () => {
  return (
    <>
      <Head>
        <title>Reimbursements</title>
      </Head>
      <div className="grid h-72 w-full place-items-center rounded-md bg-white">
        <EmptyState
          title="Reimbursements is empty"
          description="Wala pa kasing nagagawa na hayop ka! Magcode ka"
          icon={MdDashboard as IconType}
        >
          <div className="h-10 w-32 rounded-md bg-primary-normal"></div>
        </EmptyState>
      </div>
    </>
  );
};

export default Reimbursements;
