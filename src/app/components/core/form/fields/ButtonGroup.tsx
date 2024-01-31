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
              className="text-xs font-bold text-neutral-900"
            >
              {label} {required && <span className="text-orange-600">*</span>}
            </label>
          )}

          {formContext ? (
            <div
              {...formContext.register(name)}
              className="mt-1 inline-flex flex-1 overflow-hidden rounded border border-neutral-500"
              {...rest}
            >
              {options.map((option) => {
                return (
                  <button
                    aria-label={option.label}
                    key={option.value}
                    type="button"
                    className={classNames(
                      "relative inline-flex h-[32px] flex-1 border-collapse items-center justify-center px-3 py-2 text-sm font-medium transition-all focus:outline-none",
                      selected?.value === option.value
                        ? "bg-orange-600 text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-orange-700",
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
              className="mt-1 inline-flex flex-1 overflow-hidden rounded border border-neutral-500"
              {...rest}
            >
              {options.map((option) => {
                return (
                  <button
                    aria-label={option.label}
                    key={option.value}
                    type="button"
                    className={classNames(
                      "relative inline-flex h-[32px] flex-1 border-collapse items-center justify-center px-3 py-2 text-sm font-medium transition-all focus:outline-none",
                      selected?.value === option.value
                        ? "bg-orange-600 text-white"
                        : "bg-white text-neutral-600 hover:bg-orange-100 hover:text-orange-600",
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
