import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import PageAnimation from "~/components/animation/PageAnimation";
import MyApprovals from "~/components/shared/MyApprovals";

interface DashboardSSRProps {
  userJson: string;
}

const Approvals: NextPage<DashboardSSRProps> = () => {
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

  if (!user) {
    return {
      redirect: {
        destination: "/api/auth/login",
        permanent: false,
      },
    };
  }

  const userOrgs = user.getOrgs();
  const assignedRole = userOrgs[0].assignedRole;

  if (assignedRole === "HRBP") {
    return {
      redirect: {
        destination: "/dashboard",
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
