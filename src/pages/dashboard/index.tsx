import Head from "next/head";
import React from "react";
import Footer from "~/components/core/layout/Footer";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";

const Dashboard: React.FC = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <section className="grid place-items-center gap-4">
        <div className="flex h-[300px] w-full flex-col items-center justify-center gap-5 rounded-md bg-white p-4">
          <div className="flex flex-col items-center gap-4">
            <h1
              className={`${barlow_Condensed.variable} font-barlowCondensed text-[24px] font-bold text-navy md:text-[36px]`}
            >
              Welcome to Reimbursements!
            </h1>

            <p className="w-3/4 text-xs text-neutral-normal md:w-full md:text-base">
              Process expense reimbursements in a faster, more efficient manner.
              File all of your reimbursements in one place!
            </p>
          </div>

          <div className="h-10 w-32 rounded-md bg-primary-normal"></div>
        </div>

        <Footer></Footer>
      </section>
    </>
  );
};

export default Dashboard;
