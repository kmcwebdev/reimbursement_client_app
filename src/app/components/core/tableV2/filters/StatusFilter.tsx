import { useMemo, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import ReferencesApiService from "~/app/api/services/references-service";
import Popover from "../../Popover";
import StatusBadge, { type StatusType } from "../../StatusBadge";
import Checkbox from "../../form/fields/Checkbox";
import { type OptionData } from "../../form/fields/Select";
import { type FilterProps } from "./filter-props.type";

const StatusFilter: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const [statusOptions, setStatusOptions] = useState<OptionData[]>();
  const { data: allStatuses, isLoading: allStatusesIsLoading } =
    ReferencesApiService.useAllStatus();

  useMemo(() => {
    const options: OptionData[] = [];
    if (!allStatusesIsLoading && allStatuses) {
      allStatuses.results.forEach((opt) => {
        options.push({
          value: opt.id,
          label: opt.name,
        });
      });
      setStatusOptions(options);
    }
  }, [allStatusesIsLoading, allStatuses]);

  const onChange = (e: ChangeEvent<HTMLInputElement>, value: number) => {
    let request_status__id: string | undefined = "";

    const currentStatusFilters = filters?.request_status__id;

    if (currentStatusFilters) {
      if (currentStatusFilters.split(",").includes(value.toString())) {
        const filtered = currentStatusFilters
          .split(",")
          .filter((a) => a !== value.toString());

        if (filtered.length === 0) {
          request_status__id = undefined;
        } else {
          request_status__id = filtered.join(",");
        }
      } else {
        request_status__id = currentStatusFilters + "," + value.toString();
      }
    } else {
      request_status__id = value.toString();
    }

    setFilters({
      ...filters,
      page: undefined,
      request_status__id,
    });
  };

  return (
    <Popover
      ariaLabel="Pick Status"
      panelClassName="-translate-x-[85%]"
      btn={<FaCaretDown className="text-neutral-900 hover:text-neutral-800" />}
      content={
        <div className="flex w-40 flex-col">
          <div className="flex h-10 items-center border-b px-4 text-orange-600">
            Pick Status
          </div>
          <div className="bg-neutral-50 p-2 md:p-4">
            <div className="flex flex-col gap-2 capitalize">
              {statusOptions?.map((option) => (
                <Checkbox
                  key={option.value}
                  label={
                    <StatusBadge
                      status={option.label.toLowerCase() as StatusType}
                    />
                  }
                  name={option.label}
                  checked={filters?.request_status__id
                    ?.split(",")
                    .includes(option.value.toString())}
                  onChange={(e) => onChange(e, +option.value)}
                />
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default StatusFilter;
