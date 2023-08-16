import Head from "next/head";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { MdDashboard } from "react-icons-all-files/md/MdDashboard";
import PageAnimation from "~/components/animation/PageAnimation";
import EmptyState from "~/components/core/EmptyState";

const Approvals: React.FC = () => {
  return (
    <>
      <Head>
        <title>Approvals</title>
      </Head>
      <PageAnimation>
        <div className="grid h-72 w-full place-items-center rounded-md bg-white">
          <EmptyState
            title="Approvals is empty"
            description="Wala pa kasing nagagawa na hayop ka! Magcode ka"
            icon={MdDashboard as IconType}
          >
            <div className="bg-primary-normal h-10 w-32 rounded-md"></div>
          </EmptyState>
        </div>
      </PageAnimation>
    </>
  );
};

export default Approvals;
