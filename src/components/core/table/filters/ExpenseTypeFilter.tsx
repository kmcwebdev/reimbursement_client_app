import { useEffect, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setApprovalTableFilters } from "~/features/approval-page-state-slice";
import { useAllExpenseTypesQuery } from "~/features/reimbursement-api-slice";
import { setReimbursementsTableFilters } from "~/features/reimbursement-request-page-slice";
import { classNames } from "~/utils/classNames";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import { type FilterProps } from "./StatusFilter";

const ExpenseTypeFilter: React.FC<FilterProps> = ({ tableType }) => {
  const { filters: approvalPageFilters } = useAppSelector(
    (state) => state.approvalPageState,
  );

  const { filters: reimbursementsPageFilters } = useAppSelector(
    (state) => state.reimbursementRequestPageState,
  );

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
    if (tableType === "approvals") {
      dispatch(
        setApprovalTableFilters({
          ...approvalPageFilters,
          expense_type_ids: checked.join(","),
        }),
      );
    }

    if (tableType === "reimbursements") {
      dispatch(
        setReimbursementsTableFilters({
          ...reimbursementsPageFilters,
          expense_type_ids: checked.join(","),
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <Popover
      btn={
        <FaCaretDown
          className={classNames(
            // isButtonHidden && "hidden",
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
          {/* <CollapseHeightAnimation isVisible={checked.length > 0}>
            <Button buttonType="text" onClick={showAll}>
              Show All
            </Button>
          </CollapseHeightAnimation> */}
        </div>
      }
    />
  );
};

export default ExpenseTypeFilter;
