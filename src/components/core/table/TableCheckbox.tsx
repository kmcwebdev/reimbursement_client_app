/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type HTMLProps } from "react";

export type IndeterminateCheckboxProps = {
  indeterminate?: boolean;
} & HTMLProps<HTMLInputElement>;

const TableCheckbox: React.FC<IndeterminateCheckboxProps> = ({
  indeterminate,
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
    <input
      type="checkbox"
      ref={ref}
      className="h-4 w-4 cursor-pointer rounded border-neutral-subtle text-primary-default focus:ring-0 focus:ring-transparent"
      {...rest}
    />
  );
};

export default TableCheckbox;
