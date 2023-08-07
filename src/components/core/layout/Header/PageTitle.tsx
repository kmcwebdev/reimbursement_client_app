import { useRouter } from "next/router";
import React from "react";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";

const PageTitle: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <div
      className={`${barlow_Condensed.variable} font-barlowCondensed text-2xl font-bold uppercase text-navy`}
    >
      {pathname.replaceAll("/", "")}
    </div>
  );
};

export default PageTitle;
