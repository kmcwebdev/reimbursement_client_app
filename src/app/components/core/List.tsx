import React, { type PropsWithChildren } from "react";
import { classNames } from "~/utils/classNames";

interface ItemProps {
  label: string;
  value: string | number | JSX.Element;
}

const List: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex w-full flex-col gap-5">{children}</div>;
};

const Item: React.FC<ItemProps> = ({ label, value }) => {
  return (
    <div
      className={classNames(
        label !== "Expense" && "items-center",
        "grid grid-cols-2 gap-4",
      )}
    >
      <span className="text-neutral-700">{label}</span>

      {/* Checks the value if JSX.Element */}
      <>
        {React.isValidElement(value) ? (
          value
        ) : (
          <span className="text-neutral-900">{value}</span>
        )}
      </>
    </div>
  );
};

Item.displayName = "Item";

export default Object.assign(List, { Item });
