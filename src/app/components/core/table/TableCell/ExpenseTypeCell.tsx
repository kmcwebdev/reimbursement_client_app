import React, { useEffect, useState } from "react";
import { type IParticularDetails } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";

interface ExpenseTypeCellProps {
  value: IParticularDetails[];
  tableType?: string;
}

const ExpenseTypeCell: React.FC<ExpenseTypeCellProps> = ({
  value,
  tableType,
}) => {
  const [itemsToDisplay, setItemsToDisplay] = useState<string[]>([]);
  const [remainingItems, setRemainingItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let totalChars = 0;
    let remainingItems = 0;
    setLoading(true);
    const items: string[] = [];

    [...new Set(value.map((item) => item.expense_type.name))].forEach((a) => {
      if (totalChars + a.length <= 33) {
        items.push(a);
        totalChars += a.length;
      } else {
        remainingItems = remainingItems + 1;
      }
    });

    setRemainingItems(remainingItems);
    setItemsToDisplay(items);
    setLoading(false);
  }, [value]);

  return (
    <div className="gap-1">
      {!loading && (
        <>
          <div className="hidden h-full select-none items-center justify-center gap-1 md:flex md:justify-normal">
            {itemsToDisplay &&
              itemsToDisplay.length > 0 &&
              [...new Set(itemsToDisplay.map((item) => item))].map((a) => (
                <div
                  key={a}
                  className="grid h-6 items-center rounded border border-neutral-900 border-opacity-20 bg-neutral-50 px-2 text-sm text-neutral-900"
                >
                  <div
                    className={classNames(
                      remainingItems > 0 ? "w-16" : "w-20",
                      "block text-center sm:w-36 md:hidden",
                    )}
                  >
                    <p className="truncate">{a}</p>
                  </div>

                  <div className="hidden md:flex">
                    <p className="truncate">{a}</p>
                  </div>
                </div>
              ))}
            {remainingItems > 0 && (
              <div className="grid h-6 place-items-center rounded border border-neutral-900 border-opacity-20 bg-neutral-50 px-2 text-sm text-neutral-900">
                +{remainingItems}
              </div>
            )}
          </div>

          <div
            className={classNames(
              tableType !== "reimbursements",
              "flex h-full select-none items-center  gap-1 md:hidden md:justify-normal",
            )}
          >
            <div className="grid h-6 items-center rounded border border-neutral-900 border-opacity-20 bg-neutral-50 px-2 text-sm text-neutral-900">
              <div
                className={classNames(
                  value.length === 1 ? "w-24" : "w-16",
                  " text-center",
                )}
              >
                <p className="truncate">{value[0].expense_type.name}</p>
              </div>
            </div>

            {value.length > 1 && (
              <div className="grid h-6 place-items-center rounded border border-neutral-900 border-opacity-20 bg-neutral-50 px-2 text-sm text-neutral-900">
                +{value.length - 1}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseTypeCell;
