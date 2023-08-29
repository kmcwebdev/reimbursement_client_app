import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import { type FilterProps } from "./StatusFilter";

const ExpenseTypeFilter: React.FC<FilterProps> = ({
  column, // table,
}) => {
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort() as string[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()],
  );

  useEffect(() => {
    column.setFilterValue(sortedUniqueValues);
  }, [column, sortedUniqueValues]);

  useEffect(() => {
    if (column.getFilterValue()) {
      setChecked(column.getFilterValue() as string[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFilterValue()]);

  const [checked, setChecked] = useState(sortedUniqueValues);

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    if (checked.includes(value)) {
      setChecked(checked.filter((a) => a !== value));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setChecked([...checked, value]);
    }
    if (e.target.checked) {
      column.setFilterValue((old: string[]) =>
        old ? [...old, value] : [value],
      );
    } else {
      column.setFilterValue((old: string[]) =>
        old ? old.filter((a) => a !== value) : undefined,
      );
    }
  };

  const showAll = () => {
    setChecked(sortedUniqueValues);
    column.setFilterValue(sortedUniqueValues);
  };

  return (
    <Popover
      btn={<FaCaretDown />}
      content={
        <div className="w-32 p-4">
          <div className="flex flex-col gap-2 capitalize">
            {sortedUniqueValues &&
              sortedUniqueValues.length > 0 &&
              sortedUniqueValues.map((option: string) => (
                <Checkbox
                  key={option}
                  label={option}
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

export default ExpenseTypeFilter;
