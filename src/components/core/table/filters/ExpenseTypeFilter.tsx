import { useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { useAllExpenseTypesQuery } from "~/features/reimbursement-api-slice";
import { classNames } from "~/utils/classNames";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import { type FilterProps } from "./StatusFilter";

const ExpenseTypeFilter: React.FC<FilterProps> = ({
  column,
  isButtonHidden = false,
}) => {
  const { data: allExpenseTypes, isLoading: allExpenseTypesIsLoading } =
    useAllExpenseTypesQuery({});

  const [checked, setChecked] = useState<string[]>([]);

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
    setChecked([]);
    column.setFilterValue(undefined);
  };

  console.log(checked);

  return (
    <Popover
      btn={
        <FaCaretDown
          className={classNames(
            isButtonHidden && "hidden",
            "text-neutral-900 hover:text-neutral-800",
          )}
        />
      }
      content={
        <div className="w-full space-y-4 p-4">
          <div className="flex h-48 gap-2 overflow-y-auto capitalize">
            <div className="flex flex-col gap-4">
              {!allExpenseTypesIsLoading &&
                allExpenseTypes &&
                allExpenseTypes.length > 0 &&
                allExpenseTypes.map((option) => (
                  <Checkbox
                    key={option.expense_type_id}
                    label={option.expense_type}
                    name={option.expense_type_id}
                    checked={checked.includes(option.expense_type_id)}
                    onChange={(e) => onChange(e, option.expense_type_id)}
                  />
                ))}
            </div>
          </div>
          <CollapseHeightAnimation isVisible={checked.length > 0}>
            <Button buttonType="text" onClick={showAll}>
              Show All
            </Button>
          </CollapseHeightAnimation>
        </div>
      }
    />
  );
};

export default ExpenseTypeFilter;
