import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { classNames } from "~/utils/classNames";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import { type FilterProps } from "./StatusFilter";

const ReimbursementTypeFilter: React.FC<FilterProps> = ({ column }) => {
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort() as string[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()],
  );

  const [checked, setChecked] = useState(sortedUniqueValues);

  useEffect(() => {
    column.setFilterValue(sortedUniqueValues);
  }, [column, sortedUniqueValues]);

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    if (checked.includes(value)) {
      setChecked(checked.filter((a) => a !== value));
    } else {
      setChecked([...checked, value]);
    }

    column.setFilterValue(checked);
  };

  const showAll = () => {
    setChecked(sortedUniqueValues);
    column.setFilterValue(sortedUniqueValues);
  };

  useEffect(() => {
    if (checked.length !== sortedUniqueValues.length) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [checked, sortedUniqueValues]);

  return (
    <Popover
      btn={
        <FaCaretDown
          className={classNames(hasChanges && "text-primary-default")}
        />
      }
      content={
        <div className="w-32 p-4">
          <div className="flex flex-col gap-2 capitalize">
            {sortedUniqueValues &&
              sortedUniqueValues.length > 0 &&
              sortedUniqueValues.map((option: string) => (
                <Checkbox
                  key={option}
                  label={
                    <div className="flex items-center gap-2 capitalize">
                      {option}
                    </div>
                  }
                  value={option}
                  name={option}
                  checked={checked.includes(option)}
                  disabled={checked.length === 1 && checked.includes(option)}
                  onChange={(e) => onChange(e, option)}
                />
              ))}

            <CollapseHeightAnimation
              isVisible={checked.length < sortedUniqueValues.length}
            >
              <Button buttonType="text" onClick={showAll}>
                Show All
              </Button>
            </CollapseHeightAnimation>
          </div>
        </div>
      }
    />
  );
};

export default ReimbursementTypeFilter;
