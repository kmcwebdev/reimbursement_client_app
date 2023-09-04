import { type NextPage } from "next";
import React, { Fragment } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useUserAccessContext } from "~/context/AccessContext";

const ManagerApproval = dynamic(
  () => import("~/components/approval/Manager")
)

const Approvals: NextPage = () => {
   const { user } = useUserAccessContext();
   
  return (
    <Fragment>
      <Head>
        Approval
      </Head>

      {user && user.role === "manager" && <ManagerApproval />}

    </Fragment>
  )
};

export default Approvals;
