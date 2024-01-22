import { type Metadata } from "next";
import LoginComponent from "./LoginComponent";

export const metadata: Metadata = {
  title: "Login",
};

const Login: React.FC = () => {
  return <LoginComponent />;
};

export default Login;
