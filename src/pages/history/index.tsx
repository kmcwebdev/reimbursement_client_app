import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import PageAnimation from "~/components/animation/PageAnimation";
import ReimbursementHistory from "~/components/shared/ReimbursementHistory";

interface DashboardSSRProps {
  userJson: string;
}

const ReimbursementsHistory: NextPage<DashboardSSRProps> = () => {
  return (
    <div>
      <Head>
        <title>Reimbursements History</title>
      </Head>
      <PageAnimation>
        <ReimbursementHistory />
      </PageAnimation>
    </div>
  );
};

export default ReimbursementsHistory;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromServerSideProps(context);

  if (!user) {
    return {
      redirect: {
        destination: "/api/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userJson: JSON.stringify(user),
    },
  };
};