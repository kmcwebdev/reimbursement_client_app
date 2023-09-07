import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type PropsWithChildren } from "react";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";

export interface DrawerProps extends PropsWithChildren {
  isVisible: boolean;
  closeDrawer: () => void;
  title?: string;
}

const SideDrawer: React.FC<DrawerProps> = ({
  closeDrawer,
  isVisible,
  title,
  children,
}) => {
  return (
    <Transition.Root show={isVisible} as={Fragment}>
      <Dialog
        as="div"
        className={`${karla.variable} ${barlow_Condensed.variable} relative z-20`}
        onClose={closeDrawer}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed bottom-5 right-5 top-5 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-400 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-400 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen md:w-[424px]">
                  <div className="flex h-full flex-col rounded bg-white shadow-xl">
                    <div className="border-neutral-subtle flex h-[72px] items-center justify-between border-b px-4">
                      <Dialog.Title className="font-karla text-lg font-bold uppercase text-neutral-900">
                        <span>{title}</span>
                      </Dialog.Title>

                      <button type="button" onClick={closeDrawer}>
                        <MdClose className="h-4 w-4 text-neutral-800 transition-all hover:text-neutral-900" />
                      </button>
                    </div>

                    <div className="relative flex-1 overflow-y-auto">
                      <div className="absolute inset-0">{children}</div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SideDrawer;
