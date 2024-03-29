/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover as HUIPopover, Transition } from "@headlessui/react";
import React, { Fragment, type Ref } from "react";
import { classNames } from "~/utils/classNames";

interface PopoverProps {
  btn: JSX.Element;
  panelOpenBtn?: JSX.Element;
  content: JSX.Element;
  panelClassName?: string;
  buttonRef?: Ref<HTMLButtonElement>;
  ariaLabel: string;
}

const Popover: React.FC<PopoverProps> = ({
  btn,
  content,
  panelClassName,
  buttonRef,
  ariaLabel,
  panelOpenBtn,
  ...rest
}) => {
  return (
    <HUIPopover as="div" className="relative" {...rest}>
      {({ open }) => (
        /* Use the `open` state to conditionally change the direction of the chevron icon. */
        <>
          <HUIPopover.Button
            aria-label={ariaLabel}
            name={ariaLabel}
            ref={buttonRef}
            className="w-full cursor-pointer focus:outline-none"
          >
            {panelOpenBtn && open ? panelOpenBtn : btn}
          </HUIPopover.Button>
          <div className="relative">
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <HUIPopover.Panel
                className={classNames(
                  "min-w-32 absolute top-2 z-50  transform px-4 transition-all ease-in-out sm:px-0",
                  panelClassName,
                )}
              >
                <div className="rounded bg-white shadow-lg ring-[2px] ring-black ring-opacity-5">
                  {content}
                </div>
              </HUIPopover.Panel>
            </Transition>
          </div>
        </>
      )}
    </HUIPopover>
  );
};

export default Popover;
