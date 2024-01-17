import { redirect } from "next/navigation";

const NotFound = () => {
  redirect("/page-not-found");
};

export default NotFound;
