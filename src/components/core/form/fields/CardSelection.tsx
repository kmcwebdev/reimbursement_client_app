import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { classNames } from "~/utils/classNames";

export type CardSelectionOption = {
  icon: IconType;
  value: string | number;
  label: string;
};

export interface CardSelectionProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  selected?: CardSelectionOption;
  loading?: boolean;
  options: CardSelectionOption[];
  label: string;
  handleChange: (e: CardSelectionOption) => void;
  defaultValue?: string | number;
  placeholder?: string;
  name: string;
  required?: boolean;
}

const CardSelection = React.forwardRef<HTMLDivElement, CardSelectionProps>(
  (
    {
      handleChange,
      label,
      loading,
      options,
      defaultValue,
      name,
      required = false,
      ...rest
    },
    ref,
  ) => {
    const formContext = useFormContext();

    const [selected, setSelected] = useState<CardSelectionOption>();

    useEffect(() => {
      if (formContext && selected) {
        formContext.setValue(name, selected.value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formContext, selected]);

    useEffect(() => {
      if (options && defaultValue) {
        const idx = options.findIndex((item) => item.value === defaultValue);
        idx >= 0 && setSelected(options[idx]);

        if (formContext) {
          formContext.setValue(name, options[idx]);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue, options]);

    const handleClick = (e: CardSelectionOption) => {
      handleChange(e);
      formContext && formContext.setValue(name, e.value);
      setSelected(e);
    };

    if (loading) {
      return "Loading...";
    }

    return (
      <div>
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
              className="mt-2 inline-flex flex-1 gap-4 overflow-hidden"
              {...rest}
              ref={ref}
            >
              {options.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={classNames(
                      selected?.value === option.value
                        ? "border-primary-default bg-white"
                        : "border-neutral-subtle bg-white text-neutral-default hover:bg-neutral-100 hover:text-primary-hover",
                      "group flex h-24 flex-1 flex-col justify-center gap-2 rounded border px-4 py-[0.6rem] text-sm font-medium transition-all ease-in-out",
                    )}
                    onClick={() => handleClick(option)}
                  >
                    <OptionIcon
                      className={classNames(
                        selected?.value === option.value
                          ? "text-primary-default"
                          : "text-navy",
                        "h-5 w-5",
                      )}
                    />

                    <p
                      className={classNames(
                        selected?.value === option.value
                          ? "text-navy"
                          : "text-navy ",
                      )}
                    >
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              className="mt-2 flex flex-1 items-center gap-4 overflow-hidden"
              {...rest}
            >
              {options.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={classNames(
                      "group relative flex h-24 flex-1 flex-col justify-center gap-2 rounded border border-transparent px-4 py-[0.6rem] text-sm font-medium transition-all ease-in-out focus:outline-none focus:ring-0",
                      selected?.value === option.value
                        ? "border-primary-default bg-white"
                        : "border-neutral-subtle bg-white text-neutral-default hover:bg-neutral-100 hover:text-primary-hover",
                    )}
                    onClick={() => handleClick(option)}
                  >
                    <OptionIcon
                      className={classNames(
                        selected?.value === option.value
                          ? "text-primary-default"
                          : "text-navy",
                        "h-5 w-5",
                      )}
                    />

                    <p
                      className={classNames(
                        selected?.value === option.value
                          ? "text-navy"
                          : "text-navy ",
                      )}
                    >
                      {option.label}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {formContext &&
          formContext.formState.errors &&
          formContext.formState.errors[name] &&
          formContext.formState.errors[name]?.message && (
            <p className="mt-1 text-sm text-danger-default">
              {formContext.formState.errors[name]?.message as string}
            </p>
          )}
      </div>
    );
  },
);

CardSelection.displayName = "CardSelection";

export default CardSelection;
