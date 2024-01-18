import { type Metadata } from "next";
import React from "react";
import Profile from "../components/profile";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfilePage: React.FC = () => {
  return <Profile />;
};

export default ProfilePage;
