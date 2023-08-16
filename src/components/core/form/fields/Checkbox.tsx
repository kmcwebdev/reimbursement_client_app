import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
}

const Checkbox = ({ label, name, checked, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const formContext = useFormContext();

  useEffect(() => {
    if (checked || (formContext && formContext.getValues(name)))
      setIsChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, formContext]);

  return (
    <fieldset>
      <legend className="sr-only">Checkbox</legend>
      <div>
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            {formContext && (
              <input
                {...formContext.register(name)}
                name={name}
                id={name}
                aria-describedby={name}
                type="checkbox"
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  onChange && onChange(e);
                }}
                checked={isChecked}
                className="h-4 w-4 rounded border-neutral-subtle text-primary-default focus:ring-0 focus:ring-transparent"
              />
            )}

            {!formContext && (
              <input
                id={name}
                name={name}
                aria-describedby={name}
                type="checkbox"
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  onChange && onChange(e);
                }}
                checked={isChecked}
                className="h-4 w-4 rounded border-neutral-subtle text-primary-default focus:ring-0 focus:ring-transparent"
              />
            )}
          </div>
          <div className="ml-3">
            <label
              htmlFor={name}
              className="text-ne cursor-pointer text-xs leading-6 text-neutral-pressed"
            >
              {label}
            </label>
          </div>
        </div>
      </div>
    </fieldset>
  );
};

Checkbox.displayName = "Checkbox";

export default Checkbox;
