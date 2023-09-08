import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type NextPage, type GetServerSideProps } from "next";
import { Button } from "~/components/core/Button";

interface SSRProps {
  userJson: string;
}

const Home: NextPage<SSRProps> = () => {
  return (
    <section className="grid h-full w-full place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1>Welcome!</h1>
        <p>File your reimbursements in one place!</p>
        <Button>File a Reimbursement</Button>
      </div>
    </section>
  );
};

export default Home;

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
