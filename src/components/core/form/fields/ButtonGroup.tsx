import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { classNames } from "~/utils/classNames";

export type ButtonGroupOption = {
  value: string | number;
  label: string;
};

export interface ButtonGroupProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  selected?: ButtonGroupOption;
  options: ButtonGroupOption[];
  label: string;
  handleChange: (e: ButtonGroupOption) => void;
  defaultValue?: string | number;
  placeholder?: string;
  name: string;
  required?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      handleChange,
      label,
      options,
      defaultValue,
      name,
      required = false,
      ...rest
    },
    ref,
  ) => {
    const formContext = useFormContext();

    const [selected, setSelected] = useState<ButtonGroupOption>();

    useEffect(() => {
      if (options) {
        const idx = options.findIndex((item) => item.value === defaultValue);
        idx >= 0 && setSelected(options[idx]);

        if (!defaultValue) {
          setSelected(options[0]);
        }

        if (formContext) {
          formContext.setValue(name, options[idx]);
        }
      }
    }, [defaultValue, formContext, name, options]);

    const handleClick = (e: ButtonGroupOption) => {
      handleChange && handleChange(e);
      setSelected(e);
    };

    return (
      <div ref={ref}>
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={name}
              className="text-xs font-semibold text-neutral-800"
            >
              {label}{" "}
              {required && <span className="text-primary-default">*</span>}
            </label>
          )}

          {formContext ? (
            <div
              {...formContext.register(name)}
              className="mt-1 inline-flex flex-1 overflow-hidden rounded border border-neutral-subtle"
              {...rest}
            >
              {options.map((option) => {
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={classNames(
                      "relative inline-flex flex-1 border-collapse items-center justify-center px-4 py-[0.6rem] text-sm font-medium transition-all focus:outline-none",
                      selected?.value === option.value
                        ? "bg-primary-default text-white"
                        : "bg-white text-neutral-default hover:bg-primary-subtle hover:text-primary-hover ",
                    )}
                    onClick={() => handleClick(option)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              className="mt-1 inline-flex flex-1 overflow-hidden rounded border border-neutral-subtle"
              {...rest}
            >
              {options.map((option) => {
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={classNames(
                      "relative inline-flex flex-1 border-collapse items-center justify-center px-4 py-[0.6rem] text-sm font-medium transition-all focus:outline-none",
                      selected?.value === option.value
                        ? "bg-primary-default text-white"
                        : "bg-white text-neutral-default hover:bg-primary-subtle hover:text-primary-hover ",
                    )}
                    onClick={() => handleClick(option)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* {errors && (
            <p className="mt-1 text-sm text-red-600" id="email-error">
              {errors}
            </p>
          )} */}
        </div>
      </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";

export default ButtonGroup;
