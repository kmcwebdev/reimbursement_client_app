import React, { useEffect, useState } from "react";
import { type IParticularDetails } from "~/types/reimbursement.types";

interface ExpenseTypeCellProps {
  value: IParticularDetails[];
}

const ExpenseTypeCell: React.FC<ExpenseTypeCellProps> = ({ value }) => {
  const [itemsToDisplay, setItemsToDisplay] = useState<string[]>([]);
  const [remainingItems, setRemainingItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let totalChars = 0;
    let remainingItems = 0;
    setLoading(true);
    const items: string[] = [];

    value.forEach((a) => {
      if (totalChars + a.expense_type.name.length <= 33) {
        items.push(a.expense_type.name);
        totalChars += a.expense_type.name.length;
        console.log(a.expense_type.name, a.expense_type.name.length);
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
        <div className="flex h-full select-none items-center gap-1">
          {itemsToDisplay &&
            itemsToDisplay.length > 0 &&
            itemsToDisplay.map((a) => (
              <div
                key={a}
                className="grid h-6 place-items-center rounded border border-neutral-900 border-opacity-20 bg-neutral-50 px-2 text-sm text-neutral-900"
              >
                {a}
              </div>
            ))}
          {remainingItems > 0 && (
            <div className="grid h-6 place-items-center rounded border border-neutral-900 border-opacity-20 bg-neutral-50 px-2 text-sm text-neutral-900">
              +{remainingItems}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseTypeCell;
