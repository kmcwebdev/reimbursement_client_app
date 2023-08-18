/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useMemo, useState, type SelectHTMLAttributes } from "react";
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form";

import { type IconType } from "react-icons-all-files";
import type {
  CSSObjectWithLabel,
  ControlProps,
  GroupBase,
  InputActionMeta,
  MultiValue,
  PropsValue,
  SingleValue,
} from "react-select";
import AsyncSelect from "react-select/async";
import { asyncLoadOptions } from "~/utils/async-load-select-options";
import { classNames } from "~/utils/classNames";
import { debounce } from "~/utils/debounce";

import CustomControl from "./CustomControl";
import CustomDropdownIndicator from "./CustomDropdownIndicator";
import Placeholder from "./Placeholder";
import {
  clearIndicatorConfig,
  controlConfig,
  inputConfig,
  menuConfig,
  optionConfig,
  themeConfig,
} from "./select.config";

export type OptionData = {
  value: string;
  label: string;
  color?: string;
  isFixed?: undefined;
  isDisabled?: undefined;
  valueAsNum?: number;
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  icon?: IconType;
  label?: string;
  name: string;
  isLoading?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  closeOnSelect?: boolean;
  closeMenuOnSelect?: boolean;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  onChangeEvent?: (value: PropsValue<OptionData>) => void;
  options: OptionData[];
  required?: boolean;
  showError?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  initialValue?: PropsValue<OptionData>;
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
  options,
  placeholder = "Select an Option",
  isSearchable,
  initialValue,
  hasError = false,
  required = false,
}) => {
  const [value, setValue] = useState<
    MultiValue<OptionData> | SingleValue<OptionData>
  >();
  const formContext = useFormContext();

  useEffect(() => {
    if (initialValue && !formContext) {
      setValue(initialValue);
    }

    if (formContext && !initialValue) {
      setValue(formContext.getValues(name));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, formContext]);

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

  const handleChange = (
    newValue: MultiValue<OptionData> | SingleValue<OptionData>,
    // actionMeta: ActionMeta<OptionData>,
  ) => {
    setValue(newValue);
    onChangeEvent && onChangeEvent(newValue);
  };

  const asyncCustomProps = {
    components: {
      IndicatorSeparator: () => null,
      DropdownIndicator: CustomDropdownIndicator,
      Control: (
        props: ControlProps<OptionData, boolean, GroupBase<OptionData>>,
      ) => (
        <CustomControl
          Icon={Icon}
          hasError={
            hasError || formContext?.formState.errors[name] ? true : false
          }
          {...props}
        />
      ),
    },
    styles: {
      control: (
        base: CSSObjectWithLabel,
        state: ControlProps<OptionData, boolean, GroupBase<OptionData>>,
      ) => controlConfig(base, state, hasError),
      input: inputConfig,
      menu: menuConfig,
      option: optionConfig,
      clearIndicator: clearIndicatorConfig,
    },
    theme: themeConfig,
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
              {...asyncCustomProps}
              ref={ref}
              name={name}
              className={classNames("text-xs", className)}
              value={value}
              placeholder={<Placeholder>{placeholder}</Placeholder>}
              isLoading={isLoading}
              instanceId="postType"
              closeMenuOnSelect={closeOnSelect}
              isSearchable={isSearchable}
              isMulti={isMulti}
              loadOptions={(inputValue, callback) =>
                asyncLoadOptions(options, inputValue, callback)
              }
              defaultOptions={options}
              onInputChange={debouncedOnInputChange}
              onChange={(newValue) => {
                handleChange(newValue);
                onChange(newValue);
              }}
            />
          )}
        />
      ) : (
        <AsyncSelect
          {...asyncCustomProps}
          name={name}
          className={classNames("text-sm", className)}
          value={value}
          placeholder={<Placeholder>{placeholder}</Placeholder>}
          isLoading={isLoading}
          instanceId="postType"
          closeMenuOnSelect={closeOnSelect}
          isSearchable={isSearchable}
          isMulti={isMulti}
          loadOptions={(inputValue, callback) =>
            asyncLoadOptions(options, inputValue, callback)
          }
          defaultOptions={options}
          onInputChange={debouncedOnInputChange}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default Select;
