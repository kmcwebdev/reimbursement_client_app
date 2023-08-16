import { Dialog as DialogComp, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { karla } from "~/styles/fonts/karla";
import { classNames } from "~/utils/classNames";

export interface DialogProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  isVisible: boolean;
  close: () => void;
  title?: string;
  size?: "md" | "lg" | "xl" | "xxl";
}

const Dialog: React.FC<DialogProps> = ({
  close,
  isVisible,
  title,
  children,
  className,
  size = "md",
}) => {
  return (
    <>
      <Transition appear show={isVisible} as={Fragment}>
        <DialogComp
          as="div"
          className={`${karla.variable} fixed inset-0 z-50 overflow-y-auto`}
          onClose={close}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogComp.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={classNames(
                  "my-8 inline-block w-full transform rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all",
                  className && className,
                  dialogSize[size],
                )}
              >
                <button className="absolute right-3 top-3" onClick={close}>
                  <MdClose className="h-4 w-4 text-gray-400 transition-all hover:text-gray-900" />
                </button>
                {title && (
                  <DialogComp.Title
                    as="p"
                    className="font-karla text-lg font-bold"
                  >
                    {title}
                  </DialogComp.Title>
                )}

                <div>{children}</div>
              </div>
            </Transition.Child>
          </div>
        </DialogComp>
      </Transition>
    </>
  );
};

export default Dialog;

const dialogSize = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-3xl",
  xxl: "max-w-6xl",
};
