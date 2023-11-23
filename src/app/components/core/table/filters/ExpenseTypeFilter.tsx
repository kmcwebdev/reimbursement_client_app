import { useEffect, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setPageTableFilters } from "~/features/page-state.slice";
import { useAllExpenseTypesQuery } from "~/features/reimbursement-api-slice";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import { type FilterProps } from "./StatusFilter";

const ExpenseTypeFilter: React.FC<FilterProps> = () => {
  const { filters } = useAppSelector((state) => state.pageTableState);
  const { data: allExpenseTypes, isLoading: allExpenseTypesIsLoading } =
    useAllExpenseTypesQuery({});
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState<string[]>([]);

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    if (checked.includes(value)) {
      setChecked(checked.filter((a) => a !== value));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setChecked([...checked, value]);
    }
  };

  useEffect(() => {
    const expense_type_ids = checked.length ? checked.join(",") : undefined;
    dispatch(
      setPageTableFilters({
        ...filters,
        expense_type_ids,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <Popover
      btn={<FaCaretDown className="text-neutral-900 hover:text-neutral-800" />}
      content={
        <div className="flex flex-col">
          <div className="flex h-10 items-center border-b px-4 text-orange-600">
            Pick Expense Types
          </div>
          <div className="h-60 w-72 space-y-4 overflow-y-scroll bg-neutral-50 p-4">
            <div className="flex h-auto gap-2 capitalize">
              <div className="flex flex-1 flex-col gap-4">
                {!allExpenseTypesIsLoading &&
                  allExpenseTypes &&
                  allExpenseTypes.length > 0 &&
                  allExpenseTypes.map((option) => (
                    <Checkbox
                      key={option.expense_type_id}
                      label={option.expense_type}
                      name={option.expense_type_id}
                      checked={filters.expense_type_ids
                        ?.split(",")
                        .includes(option.expense_type_id)}
                      onChange={(e) => onChange(e, option.expense_type_id)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ExpenseTypeFilter;
