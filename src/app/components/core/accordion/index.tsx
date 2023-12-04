import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons-all-files/hi/HiOutlineChevronDown";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { currencyFormat } from "~/utils/currencyFormat";
import CollapseHeightAnimation from "../../animation/CollapseHeight";

interface AccordionItem {
  label: string;
  description: string;
  amount: number;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [activeItem, setActiveItem] = useState<string>();
  return (
    <div className="w-full bg-white px-4 py-16">
      <div className="mx-auto w-full max-w-md space-y-2">
        {items.length > 0 &&
          items.map((item) => (
            <div
              key={item.label}
              className="rounded-md border border-neutral-200"
            >
              <button
                className="flex w-full justify-between gap-2 p-4 text-left text-sm"
                onClick={() => {
                  if (activeItem === item.label) {
                    setActiveItem(undefined);
                  } else {
                    setActiveItem(item.label);
                  }
                }}
              >
                <MdReceipt className="h-5 w-5 text-neutral-800" />
                <div className="flex flex-1 items-center justify-between">
                  <span className="font-medium text-neutral-900">
                    {item.label}
                  </span>
                  <HiOutlineChevronDown
                    className={`${
                      activeItem === item.label
                        ? "-rotate-180 transform text-neutral-900"
                        : "text-blue-600"
                    } h-5 w-5 transition-all ease-in-out`}
                  />
                </div>
              </button>

              <CollapseHeightAnimation isVisible={activeItem === item.label}>
                <div className="flex flex-col gap-4 p-4 text-sm text-neutral-800">
                  <div>{item.description}</div>
                  <div>{currencyFormat(item.amount)}</div>
                </div>
              </CollapseHeightAnimation>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Accordion;
