import { getUserFromServerSideProps } from "@propelauth/nextjs/server/pages";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
import { type IconType } from "react-icons-all-files";
import { FaUserTie } from "react-icons-all-files/fa/FaUserTie";
import { HiBriefcase } from "react-icons-all-files/hi/HiBriefcase";
import { MdConstruction } from "react-icons-all-files/md/MdConstruction";
import { MdMail } from "react-icons-all-files/md/MdMail";
import { useAppSelector } from "~/app/hook";
import EmptyState from "~/components/core/EmptyState";

interface DashboardSSRProps {
  userJson: string;
}

const Profile: NextPage<DashboardSSRProps> = () => {
  const { user } = useAppSelector((state) => state.session);
  return (
    <Fragment>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="flex gap-8 rounded-md bg-white p-8 shadow-sm">
          <div className="h-40 w-40 rounded-full border border-orange-600 p-1">
            <div className="grid h-full w-full place-items-center rounded-full bg-neutral-300 font-barlow font-bold text-orange-600">
              <h1 className="text-7xl">
                {user && user.firstName?.charAt(0)}
                {user && user.lastName?.charAt(0)}
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex gap-4">
              <h1 className="uppercase text-navy">
                {user && user.firstName} {user && user.lastName}
              </h1>
            </div>
            <div className="flex flex-col gap-2 font-bold">
              <div className="flex items-center gap-2 text-neutral-700">
                <HiBriefcase className="h-5 w-5" />
                <p className="mt-0.5">{user && user.orgName}</p>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <FaUserTie className="h-5 w-5" />
                <p className="mt-0.5">{user && user.assignedRole}</p>
              </div>

              <div className="flex items-center gap-2 text-neutral-700">
                <MdMail className="h-5 w-5" />
                <p className="mt-0.5">{user && user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="grid h-[50vh] place-items-center bg-neutral-100">
            <EmptyState
              icon={MdConstruction as IconType}
              title="Ongoing Development"
              description="This section is still under development."
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;

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
