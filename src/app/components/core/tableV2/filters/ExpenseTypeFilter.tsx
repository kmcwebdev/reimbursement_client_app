import { type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAllExpenseTypesQuery } from "~/features/api/references-api-slice";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import { type FilterProps } from "./filter-props.type";

const ExpenseTypeFilter: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const { data: allExpenseTypes, isLoading: allExpenseTypesIsLoading } =
    useAllExpenseTypesQuery({});

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: number) => {
    let expense_type__id: string | undefined = "";
    const currentExpenseFilters = filters?.expense_type__id;

    if (currentExpenseFilters) {
      if (currentExpenseFilters.split(",").includes(value.toString())) {
        const filtered = currentExpenseFilters
          .split(",")
          .filter((a) => a !== value.toString());

        if (filtered.length === 0) {
          expense_type__id = undefined;
        } else {
          expense_type__id = filtered.join(",");
        }
      } else {
        expense_type__id = currentExpenseFilters + "," + value.toString();
      }
    } else {
      expense_type__id = value.toString();
    }

    setFilters({
      ...filters,
      page: undefined,
      expense_type__id,
    });
  };

  return (
    <Popover
      ariaLabel="Expense Type"
      panelClassName="-translate-x-1/4 md:translate-x-0"
      btn={<FaCaretDown className="text-neutral-900 hover:text-neutral-800" />}
      content={
        <div className="flex flex-col">
          <div className="flex h-10 items-center border-b px-4 text-orange-600">
            Pick Expense Types
          </div>
          <div className="relative h-60 w-72 space-y-4 overflow-y-hidden bg-neutral-50">
            <div className="flex h-60 gap-2 overflow-y-auto capitalize">
              <div className="flex flex-1 flex-col gap-4 p-4">
                {!allExpenseTypesIsLoading &&
                  allExpenseTypes &&
                  allExpenseTypes.results.length > 0 &&
                  allExpenseTypes.results.map((option) => (
                    <Checkbox
                      key={option.id}
                      label={option.name}
                      name={option.name}
                      checked={filters?.expense_type__id
                        ?.split(",")
                        .includes(option.id.toString())}
                      onChange={(e) => onChange(e, option.id)}
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
