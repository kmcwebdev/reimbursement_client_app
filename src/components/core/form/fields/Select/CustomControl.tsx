import React, { type PropsWithChildren } from "react";
import { type IconType } from "react-icons-all-files";
import { components, type ControlProps, type GroupBase } from "react-select";
import { classNames } from "~/utils/classNames";
import { type OptionData } from ".";

interface CustomControlProps
  extends ControlProps<OptionData, boolean, GroupBase<OptionData>> {
  hasError?: boolean;
  Icon?: IconType;
}

const CustomControl: React.FC<PropsWithChildren<CustomControlProps>> = ({
  hasError,
  Icon,
  children,
  ...rest
}) => {
  return (
    <components.Control {...rest}>
      <span className={classNames(Icon ? "mr-8" : "mr-0")}>
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 ">
            <Icon
              className={classNames(
                "h-5 w-5",
                hasError ? "text-red-600" : "text-neutral-600",
              )}
              aria-hidden="true"
            />
          </div>
        )}
      </span>
      {children}
    </components.Control>
  );
};

export default CustomControl;
