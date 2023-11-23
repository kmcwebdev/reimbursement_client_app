/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popover as HUIPopover, Transition } from "@headlessui/react";
import React, { Fragment, type Ref } from "react";
import { classNames } from "~/utils/classNames";

interface PopoverProps {
  btn: JSX.Element;
  content: JSX.Element;
  panelClassName?: string;
  buttonRef?: Ref<HTMLButtonElement>;
}

const Popover: React.FC<PopoverProps> = ({
  btn,
  content,
  panelClassName,
  buttonRef,
  ...rest
}) => {
  return (
    <HUIPopover as="div" className="relative" {...rest}>
      <HUIPopover.Button
        ref={buttonRef}
        className="w-full cursor-pointer focus:outline-none"
      >
        {btn}
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
              "min-w-32 absolute top-4 z-50 transform px-4 sm:px-0",
              panelClassName,
            )}
          >
            <div className="rounded bg-white shadow-lg ring-[2px] ring-black ring-opacity-5">
              {content}
            </div>
          </HUIPopover.Panel>
        </Transition>
      </div>
    </HUIPopover>
  );
};

export default Popover;
