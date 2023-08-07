import Link from 'next/link';
import React, { type PropsWithChildren } from 'react';
import { MdSettings } from 'react-icons-all-files/md/MdSettings';
import { barlow_Condensed } from '~/styles/fonts/barlowCondensed';

const Layout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <div>
    <div className="z-20 hidden w-20 border-r bg-white md:block">
        <div className="flex h-screen flex-col">
          <div className="flex h-16 items-center justify-center border-b">
            B
          </div>
          <div className="flex grow flex-col items-center gap-y-4 px-2 py-4 children:cursor-pointer ">
           
          </div>
          <div className="flex flex-col items-center gap-y-4 px-2 py-4 children:cursor-pointer ">
            <Link href={`/settings`}>
              <MdSettings className="h-6 w-6 text-neutral-normal" />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex h-16 flex-col justify-between border-b bg-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div
              className={`${barlow_Condensed.variable} font-barlowCondensed text-2xl font-bold text-primary-normal`}
            >
                Dashboard
            </div>

    
          </div>
        </div>
        <div className="relative flex h-full">
          
            
          <div className="h-full w-full overflow-hidden">{children}</div>
        </div>
      </div>
      </div>
  );
}

export default Layout;