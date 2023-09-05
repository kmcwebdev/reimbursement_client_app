import { type NextPage } from "next";
import Head from "next/head";
import PageAnimation from "~/components/animation/PageAnimation";
import MyApprovals from "~/components/shared/MyApprovals";

const Approvals: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Approval</title>
      </Head>
      <PageAnimation>
        <MyApprovals />
      </PageAnimation>
    </div>
  );
};

export default Approvals;
