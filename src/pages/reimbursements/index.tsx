import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import PageAnimation from "~/components/animation/PageAnimation";
import MyReimbursements from "~/components/shared/MyReimbursements";

interface DashboardSSRProps {
  userJson: string;
}

const Reimbursements: NextPage<DashboardSSRProps> = () => {
  return (
    <div>
      <Head>
        <title>Reimbursements</title>
      </Head>
      <PageAnimation>
        <MyReimbursements />
      </PageAnimation>
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

  const userOrgs = user.getOrgs();
  const assignedRole = userOrgs[0].assignedRole;

  if (
    assignedRole === "HRBP" ||
    assignedRole === "External Reimbursement Approver Manager"
  ) {
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
