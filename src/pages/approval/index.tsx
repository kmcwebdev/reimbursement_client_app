import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps, type NextPage } from "next";
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromServerSideProps(context);

  console.log(user?.getOrgs());

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
