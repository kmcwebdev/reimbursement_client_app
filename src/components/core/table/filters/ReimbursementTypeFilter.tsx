import React, { useEffect, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setPageTableFilters } from "~/features/page-state.slice";
import { useRequestTypesQuery } from "~/features/reimbursement-api-slice";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import { type FilterProps } from "./StatusFilter";

const ReimbursementTypeFilter: React.FC<FilterProps> = () => {
  const { filters } = useAppSelector((state) => state.pageTableState);
  const dispatch = useAppDispatch();

  const [checked, setChecked] = useState<string[]>([]);
  const { isLoading: requestTypesIsLoading, data: requestTypes } =
    useRequestTypesQuery();

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    if (checked.includes(value)) {
      setChecked(checked.filter((a) => a !== value));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setChecked([value]);
    }
  };

  useEffect(() => {
    const reimbursement_type_id =
      checked.length > 0 ? checked.join(",") : undefined;
    dispatch(
      setPageTableFilters({
        ...filters,
        reimbursement_type_id,
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
            Pick Reimbursement Types
          </div>
          <div className="w-32 bg-neutral-50 p-4">
            <div className="flex flex-col gap-2 capitalize">
              {!requestTypesIsLoading &&
                requestTypes &&
                requestTypes.length > 0 &&
                requestTypes.map((type) => (
                  <Checkbox
                    key={type.request_type}
                    label={
                      <div className="flex items-center gap-2 capitalize">
                        {type.request_type}
                      </div>
                    }
                    checked={
                      filters.reimbursement_type_id &&
                      filters.reimbursement_type_id ===
                        type.reimbursement_request_type_id
                        ? true
                        : false
                    }
                    value={type.reimbursement_request_type_id}
                    name={type.reimbursement_request_type_id}
                    onChange={(e) =>
                      onChange(e, type.reimbursement_request_type_id)
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ReimbursementTypeFilter;
