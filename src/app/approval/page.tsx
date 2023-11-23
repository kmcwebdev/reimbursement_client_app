import { getUserOrRedirect } from "@propelauth/nextjs/server/app-router";
import { type Metadata, type NextPage } from "next";
import { redirect } from "next/navigation";
import MyApprovals from "~/app/components/shared/MyApprovals";

export const metadata: Metadata = {
  title: "Approval",
};

const Approvals: NextPage = async () => {
  const user = await getUserOrRedirect();
  const userOrgs = user.getOrgs();
  const assignedRole = userOrgs[0].assignedRole;

  if (assignedRole === "HRBP" || assignedRole === "Finance") {
    redirect("/dashboard");
  }

  if (assignedRole === "Member") {
    redirect("/forbidden");
  }

  return <MyApprovals />;
};

export default Approvals;
