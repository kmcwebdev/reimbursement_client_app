/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useMemo } from "react";
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form";

import { type IconType } from "react-icons-all-files";
import { TbChevronDown } from "react-icons-all-files/tb/TbChevronDown";
import type {
  ControlProps,
  InputActionMeta,
  MultiValue,
  SingleValue,
} from "react-select";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import { classNames } from "~/utils/classNames";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<F extends (...args: any[]) => void>(
  func: F,
  waitFor: number,
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<F>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func(...args), waitFor);
  };
}

export type OptionData = {
  value: string;
  label: string;
  color: string;
  isFixed?: undefined;
  isDisabled?: undefined;
  valueAsNum?: number;
};

export type ReactSelectOnChangeEvent =
  | MultiValue<OptionData>
  | SingleValue<OptionData>;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  icon?: IconType;
  label?: string;
  name: string;
  isLoading?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  closeOnSelect?: boolean;
  placeholder?: string;
  closeMenuOnSelect?: boolean;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  onChangeEvent?: (event: ReactSelectOnChangeEvent) => void;
  data: OptionData[];
  initialValue?: OptionData[] | OptionData;
  required?: boolean;
  showError?: boolean;
  disabled?: boolean;
  hasError?: boolean;
}

const Select: React.FC<SelectProps> = ({
  className,
  icon: Icon,
  label,
  name,
  isLoading,
  isMulti = false,
  closeOnSelect = true,
  onChangeEvent,
  onInputChange,
  data,
  initialValue,
  placeholder,
  isSearchable,
  hasError,
}) => {
  const debouncedOnInputChange = useMemo(() => {
    if (onInputChange) {
      return debounce((input: string, action: InputActionMeta) => {
        if (action.action === "input-change") {
          onInputChange(input, action);
        }
      }, 300);
    } else {
      return undefined;
    }
  }, [onInputChange]);

  const formContext = useFormContext();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <TbChevronDown
          className={classNames(
            "mr-1 h-4 w-4",
            hasError || formContext?.formState.errors[name]?.message
              ? "text-red-400"
              : "text-gray-500",
          )}
        />
      </components.DropdownIndicator>
    );
  };

  const Control = ({
    children,
    ...props
  }: ControlProps<OptionData, boolean>) => {
    return (
      <components.Control {...props}>
        <span className={classNames(Icon ? "mr-8" : "mr-0")}>
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 ">
              <Icon
                className={classNames(
                  "h-5 w-5",
                  hasError || formContext?.formState.errors[name]?.message
                    ? "text-red-400"
                    : "text-gray-400",
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

  useEffect(() => {
    if (initialValue) {
      formContext?.setValue(name, initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, data]);

  const selected = formContext?.getValues<string>(name);

  const initialVal = data.find((d) => d.value === selected);

  const asyncLoadOptions = (
    inputValue: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (params: any) => void,
  ) => {
    setTimeout(() => {
      const filteredOptions = data.filter((optionsData) =>
        optionsData.label.toLowerCase().includes(inputValue?.toLowerCase()),
      );
      callback(filteredOptions);
    }, 100);
  };

  return (
    <div className="w-full">
      <label htmlFor={label?.toLowerCase()} className="text-xs text-gray-700">
        {label}
      </label>

      {formContext ? (
        <Controller
          control={formContext?.control}
          name={name}
          render={({
            field: { onChange, ref, name },
          }: {
            field: ControllerRenderProps<FieldValues, string>;
          }) => (
            <AsyncSelect
              ref={ref}
              name={name}
              className={classNames("text-sm", className)}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value={
                initialVal && {
                  label: initialVal?.label,
                  value: initialVal?.value,
                  color: "",
                }
              }
              placeholder={
                <div
                  className={classNames(
                    "text-xs font-light",
                    hasError || formContext?.formState.errors[name]?.message
                      ? "text-red-400"
                      : "",
                  )}
                >
                  {placeholder}
                </div>
              }
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator,
                Control,
              }}
              styles={{
                control: (baseStyle, state) => ({
                  ...baseStyle,
                  width: "100%",
                  minHeight: "2.6rem",
                  height: "auto",
                  borderRadius: "0.375rem",
                  background:
                    hasError || formContext?.formState.errors[name]?.message
                      ? "#fee2e2"
                      : "#EAEFF4",
                  cursor: "pointer",
                  border: state.isFocused
                    ? hasError || formContext?.formState.errors[name]?.message
                      ? "1px solid #f87171"
                      : "1px solid #047857"
                    : hasError || formContext?.formState.errors[name]?.message
                    ? "1px solid #f87171"
                    : "0 solid #047857",
                  boxShadow: state.isFocused ? "0.094rem #f97316" : "none",
                  "&:hover": {
                    boxShadow: "0.094rem solid #f97316",
                  },
                }),
                input: (baseInputStyle) => ({
                  ...baseInputStyle,
                  "input:focus": {
                    boxShadow: "none",
                    border: "none",
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  paddingBottom: "2px",
                }),
                option: (provided, state) => ({
                  ...provided,
                  background: state.isFocused ? "#6EE7B2" : "#FFFFFF",
                  color: state.isFocused ? "#272E35" : "#272E35",
                  marginTop: "3px",
                  borderRadius: "0.25rem",
                  "&:hover": {
                    cursor: "pointer",
                    background: "#6EE7B2",
                  },
                  "&:active": {
                    color: "#272E35",
                    background: "#6EE7B2",
                  },
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  color: "#FF7200",
                }),
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                },
              })}
              isLoading={isLoading}
              instanceId="postType"
              closeMenuOnSelect={closeOnSelect}
              isSearchable={isSearchable}
              isMulti={isMulti}
              loadOptions={asyncLoadOptions}
              defaultOptions={data}
              defaultValue={initialValue}
              onInputChange={debouncedOnInputChange}
              onChange={(event) => {
                onChangeEvent && onChangeEvent(event);

                onChange(event);
              }}
            />
          )}
        />
      ) : (
        <AsyncSelect
          name={name}
          className={classNames("text-sm", className)}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={
            initialVal && {
              label: initialVal?.label,
              value: initialVal?.value,
              color: "",
            }
          }
          placeholder={
            <div
              className={classNames(
                "text-xs font-light",
                hasError && "text-red-400",
              )}
            >
              {placeholder}
            </div>
          }
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator,
            Control,
          }}
          styles={{
            control: (baseStyle, state) => ({
              ...baseStyle,
              width: "100%",
              minHeight: "2.6rem",
              height: "auto",
              borderRadius: "0.375rem",
              background: hasError ? "#fee2e2" : "#EAEFF4",
              cursor: "pointer",
              border: state.isFocused
                ? hasError
                  ? "1px solid #f87171"
                  : "1px solid #047857"
                : hasError
                ? "1px solid #f87171"
                : "0 solid #047857",
              boxShadow: state.isFocused ? "0.094rem #f97316" : "none",
              "&:hover": {
                boxShadow: "0.094rem solid #f97316",
              },
            }),
            input: (baseInputStyle) => ({
              ...baseInputStyle,
              "input:focus": {
                boxShadow: "none",
                border: "none",
              },
            }),
            menu: (provided) => ({
              ...provided,
              paddingLeft: "5px",
              paddingRight: "5px",
              paddingBottom: "2px",
            }),
            option: (provided, state) => ({
              ...provided,
              background: state.isFocused ? "#6EE7B2" : "#FFFFFF",
              color: state.isFocused ? "#272E35" : "#272E35",
              marginTop: "3px",
              borderRadius: "0.25rem",
              "&:hover": {
                cursor: "pointer",
                background: "#6EE7B2",
              },
              "&:active": {
                color: "#272E35",
                background: "#6EE7B2",
              },
            }),
            clearIndicator: (provided) => ({
              ...provided,
              color: "#FF7200",
            }),
          }}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
            },
          })}
          isLoading={isLoading}
          instanceId="postType"
          closeMenuOnSelect={closeOnSelect}
          isSearchable={isSearchable}
          isMulti={isMulti}
          loadOptions={asyncLoadOptions}
          defaultOptions={data}
          defaultValue={initialValue}
          onInputChange={debouncedOnInputChange}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={onChangeEvent}
        />
      )}
    </div>
  );
};

export default Select;
