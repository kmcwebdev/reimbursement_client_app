import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { classNames } from "~/utils/classNames";
import SkeletonLoading from "../../SkeletonLoading";

export type CardSelectionOption = {
  icon: IconType;
  value: string;
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
  defaultValue?: string;
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
      if (formContext) {
        const value = formContext.getValues(name) as string;
        if (value) {
          setSelected(options.find((a) => a.value === value));
        }
        if (selected) {
          formContext.setValue(name, selected.value);
        }
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

    return (
      <div>
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={name}
              className="text-xs font-bold text-neutral-900"
            >
              {label}
              {required && <span className="text-orange-600">*</span>}
            </label>
          )}

          {loading && <CardSelectionSkeleton />}

          {!loading && formContext && (
            <div
              className="mt-2 inline-flex flex-1 gap-4 overflow-hidden"
              {...rest}
              {...formContext.register(name)}
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
                        ? "border-orange-600"
                        : "border-neutral-300 hover:bg-neutral-100",
                      "group flex h-24 flex-1 flex-col justify-center gap-2 rounded border px-4 py-[0.6rem] text-sm font-medium transition-all ease-in-out",
                    )}
                    onClick={() => handleClick(option)}
                  >
                    <OptionIcon
                      className={classNames(
                        selected?.value === option.value
                          ? "text-orange-600"
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
          {!loading && !formContext && (
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
                      selected?.value === option.value
                        ? "border-orange-600"
                        : "border-neutral-300 hover:bg-neutral-100",
                      "group flex h-24 flex-1 flex-col justify-center gap-2 rounded border px-4 py-[0.6rem] text-sm font-medium transition-all ease-in-out",
                    )}
                    onClick={() => handleClick(option)}
                  >
                    <OptionIcon
                      className={classNames(
                        selected?.value === option.value
                          ? "text-orange-600"
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

        {!selected &&
          formContext &&
          formContext.formState.errors &&
          formContext.formState.errors[name] &&
          formContext.formState.errors[name]?.message && (
            <p className="mt-1 text-sm text-red-600">
              {formContext.formState.errors[name]?.message as string}
            </p>
          )}
      </div>
    );
  },
);

export const CardSelectionSkeleton: React.FC = () => {
  return (
    <div className="mt-2 flex flex-1 items-center gap-4 overflow-hidden">
      <SkeletonLoading
        containerClassName="h-24 w-1/2 rounded-md overflow-hidden"
        className="h-full w-full"
      />
      <SkeletonLoading
        containerClassName="h-24 w-1/2 rounded-md overflow-hidden"
        className="h-full w-full"
      />
    </div>
  );
};

CardSelection.displayName = "CardSelection";

export default CardSelection;
