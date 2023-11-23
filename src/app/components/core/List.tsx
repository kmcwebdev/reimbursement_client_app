import React, { type PropsWithChildren } from "react";

interface ItemProps {
  label: string;
  value: string | number | JSX.Element;
}

const List: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="flex w-full flex-col gap-4">{children}</div>;
};

const Item: React.FC<ItemProps> = ({ label, value }) => {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
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
