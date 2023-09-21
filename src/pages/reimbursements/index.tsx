import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import PageAnimation from "~/components/animation/PageAnimation";

interface DashboardSSRProps {
  userJson: string;
}

const Reimbursements: NextPage<DashboardSSRProps> = () => {
  return (
    <div>
      <Head>
        <title>Reimbursements</title>
      </Head>
      <PageAnimation></PageAnimation>
    </div>
  );
};

export default Reimbursements;

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
