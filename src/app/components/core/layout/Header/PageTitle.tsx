import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

const PageTitle: React.FC = () => {
  const pathname = usePathname();

  // Check if pathname is not null before proceeding with includes checks
  if (pathname) {
    if (pathname.includes("email-action")) {
      return (
        <div className="relative h-6 w-[101px]">
          <Image
            src="https://cdn.kmc.solutions/project-statics/KMC-logo-updated-black%20(1).png"
            alt="kmc-logo"
            sizes="100%"
            fill
          />
        </div>
      );
    }

    if (pathname.includes("forbidden")) {
      return <h3 className="font-bold uppercase text-navy">Forbidden</h3>;
    }

    if (pathname.includes("page-not-found")) {
      return <h3 className="font-bold uppercase text-navy">Page not Found</h3>;
    }

    // Replace all slashes and hyphens in the pathname with spaces for display
    return (
      <h3 className="font-bold uppercase text-navy">
        {pathname.replaceAll("/", "").replaceAll("-", " ")}
      </h3>
    );
  }

  // Return a default title if pathname is null
  return <h3 className="font-bold uppercase text-navy">Home</h3>;
};

export default PageTitle;
