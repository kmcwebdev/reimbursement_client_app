import { type Metadata, type NextPage } from "next";
import WelcomePage from "./components/WelcomePage";

export const metadata: Metadata = {
  title: "Welcome to Reimbursements",
};

const Home: NextPage = () => {
  return <WelcomePage />;
};

export default Home;
