import React, { type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useRequestTypesQuery } from "~/features/api/references-api-slice";
import { setPageTableFilters } from "~/features/state/table-state.slice";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import { type FilterProps } from "./StatusFilter";

const ReimbursementTypeFilter: React.FC<FilterProps> = () => {
  const { filters } = useAppSelector((state) => state.pageTableState);
  const dispatch = useAppDispatch();

  const { isLoading: requestTypesIsLoading, data: requestTypes } =
    useRequestTypesQuery();

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: number) => {
    let request_type__id: string | undefined = value.toString();
    if (filters.request_type__id === request_type__id) {
      request_type__id = undefined;
    }

    dispatch(
      setPageTableFilters({
        ...filters,
        page: undefined,
        request_type__id,
      }),
    );
  };

  return (
    <Popover
      ariaLabel="Pick Reimbursement Type"
      panelClassName="-translate-x-1/4 md:translate-x-0"
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
                requestTypes.results.length > 0 &&
                requestTypes.results.map((type) => (
                  <Checkbox
                    key={type.id}
                    label={
                      <div className="flex items-center gap-2 capitalize">
                        {type.name}
                      </div>
                    }
                    checked={
                      filters.request_type__id &&
                      filters.request_type__id === type.id.toString()
                        ? true
                        : false
                    }
                    value={type.id}
                    name={type.name}
                    onChange={(e) => onChange(e, type.id)}
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
