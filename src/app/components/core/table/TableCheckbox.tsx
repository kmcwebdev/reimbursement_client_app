/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type HTMLProps } from "react";
import { classNames } from "~/utils/classNames";

export type IndeterminateCheckboxProps = {
  indeterminate?: boolean;
  showOnHover?: boolean;
  tableHasChecked?: boolean;
} & HTMLProps<HTMLInputElement>;

const TableCheckbox: React.FC<IndeterminateCheckboxProps> = ({
  indeterminate,
  showOnHover = true,
  tableHasChecked,
  id,
  ...rest
}) => {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate]);

  return (
    <>
      <label htmlFor={`table-checkbox-${id}`} className="sr-only">
        Table Checkbox
      </label>
      <input
        aria-label="Table Checkbox"
        id={`table-checkbox-${id}`}
        name={`table-checkbox-${id}`}
        type="checkbox"
        ref={ref}
        className={classNames(
          showOnHover && "opacity-0 group-hover:opacity-100",
          tableHasChecked && "opacity-100",
          "h-4 w-4 cursor-pointer rounded border-neutral-600 text-orange-600 transition-all ease-in-out checked:opacity-100 focus:ring-0 focus:ring-transparent ",
        )}
        {...rest}
      />{" "}
    </>
  );
};

export default TableCheckbox;
