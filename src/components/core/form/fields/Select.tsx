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
import { debounce } from "~/utils/debounce";

export type OptionData = {
  value: string;
  label: string;
  color?: string;
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
  placeholder = "Select an Option",
  isSearchable,
  hasError,
  required = false,
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
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-semibold text-neutral-800"
        >
          {label} {required && <span className="text-primary-default">*</span>}
        </label>
      )}

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
              className={classNames("text-xs", className)}
              value={
                initialVal && {
                  label: initialVal?.label,
                  value: initialVal?.value,
                }
              }
              placeholder={
                <div
                  className={classNames(
                    "text-xs font-light",
                    hasError || formContext?.formState.errors[name]?.message
                      ? "text-danger-default"
                      : "text-neutral-subtle",
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
                      ? "#FEF3F1"
                      : "#FFFFFF",
                  cursor: "pointer",
                  border: state.isFocused
                    ? hasError || formContext?.formState.errors[name]?.message
                      ? "1px solid #C5280C"
                      : "1px solid #FF7200"
                    : hasError || formContext?.formState.errors[name]?.message
                    ? "1px solid #C5280C"
                    : "1px solid #CACED3",
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
                  backgroundColor: state.isSelected ? "#FF7200" : "transparent",
                  color: state.isSelected ? "#FFFFFF" : "#272E35",
                  marginTop: "3px",
                  borderRadius: "0.25rem",
                  "&:hover": {
                    cursor: "pointer",
                    background: "#FF7200",
                    color: "#FFFFFF",
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
                hasError ? "text-red-400" : "text-neutral-subtle",
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
              background: hasError ? "#FEF3F1" : "#FFFFFF",
              cursor: "pointer",
              border: state.isFocused
                ? hasError
                  ? "1px solid #C5280C"
                  : "1px solid #FF7200"
                : hasError
                ? "1px solid #C5280C"
                : "1px solid #CACED3",
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
              backgroundColor: state.isSelected ? "#FF7200" : "transparent",
              color: state.isSelected ? "#FFFFFF" : "#272E35",
              marginTop: "3px",
              borderRadius: "0.25rem",
              "&:hover": {
                cursor: "pointer",
                background: "#FF7200",
                color: "#FFFFFF",
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
