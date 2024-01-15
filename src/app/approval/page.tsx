import { type Metadata, type NextPage } from "next";
import MyApprovals from "~/app/components/shared/MyApprovals";

export const metadata: Metadata = {
  title: "Approval",
};

const Approvals: NextPage = () => {
  // const user = await getUserOrRedirect();
  // const userOrgs = user.getOrgs();
  // const assignedRole = userOrgs[0].assignedRole;

  // if (assignedRole === "HRBP" || assignedRole === "Finance") {
  //   redirect("/dashboard");
  // }

  // if (assignedRole === "Member") {
  //   redirect("/forbidden");
  // }

  return <MyApprovals />;
};

export default Approvals;
