import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons-all-files/hi/HiOutlineChevronDown";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import { currencyFormat } from "~/utils/currencyFormat";
import CollapseHeightAnimation from "../../animation/CollapseHeight";

interface AccordionItem {
  id: number;
  label: string;
  description: string;
  amount: number;
}

interface AccordionProps {
  items: AccordionItem[];
  label?: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, label }) => {
  const [activeItem, setActiveItem] = useState<number>();
  return (
    <div className="flex w-full flex-col gap-4 py-4">
      {label && <h6 className="text-base font-semibold">{label}</h6>}
      <div className="mx-auto w-full max-w-md space-y-2">
        {items.length > 0 &&
          items.map((item) => (
            <div key={item.id} className="rounded-md border border-opacity-20">
              <button
                aria-label={item.label}
                className="flex w-full items-center justify-between gap-2 p-3 text-left text-sm"
                onClick={() => {
                  if (activeItem === item.id) {
                    setActiveItem(undefined);
                  } else {
                    setActiveItem(item.id);
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
                      activeItem === item.id
                        ? "-rotate-180 transform text-neutral-900"
                        : "text-neutral-600"
                    } h-4 w-4 transition-all ease-in-out`}
                  />
                </div>
              </button>

              <CollapseHeightAnimation isVisible={activeItem === item.id}>
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
