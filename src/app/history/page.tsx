// import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
// import { type GetServerSideProps, type NextPage } from "next";

import { type Metadata, type NextPage } from "next";
import ReimbursementHistory from "~/app/components/shared/ReimbursementHistory";
export const metadata: Metadata = {
  title: "Reimbursements History",
};

const ReimbursementsHistory: NextPage = () => {
  return <ReimbursementHistory />;
};

export default ReimbursementsHistory;
