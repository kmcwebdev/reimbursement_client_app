import { useRouter } from "next/router";
import React from "react";

const PageTitle: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <h3 className="font-bold uppercase text-navy">
      {pathname.replaceAll("/", "")}
    </h3>
  );
};

export default PageTitle;
