import { useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { useAllHRBPsQuery } from "~/features/api/references-api-slice";
import { useDebounce } from "~/hooks/use-debounce";
import { classNames } from "~/utils/classNames";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./filter-props.type";

const HRBPFilter: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const { data: selectedHrbps, isLoading: selectedHrbpsIsLoading } =
    useAllHRBPsQuery({ id: filters?.hrbp_id }, { skip: !filters?.hrbp_id });

  const [hrbpSearchValue, setHRBPSearchValue] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setHRBPSearchValue(searchValue);
  };

  const debouncedSearchText = useDebounce(hrbpSearchValue, 500);
  const { data: allHrbps, isLoading: allHrbpssIsLoading } = useAllHRBPsQuery(
    { search: debouncedSearchText, page_size: 100 },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const onChange = (value: number) => {
    let hrbp_id: string | undefined = "";
    const currentHrbpFilters = filters?.hrbp_id;

    if (currentHrbpFilters) {
      if (currentHrbpFilters.split(",").includes(value.toString())) {
        const filtered = currentHrbpFilters
          .split(",")
          .filter((a) => a !== value.toString());

        if (filtered.length === 0) {
          hrbp_id = undefined;
        } else {
          hrbp_id = filtered.join(",");
        }
      } else {
        hrbp_id = currentHrbpFilters + "," + value.toString();
      }
    } else {
      hrbp_id = value.toString();
    }

    setFilters({
      ...filters,
      page: undefined,
      hrbp_id,
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
            Pick HRBP/s
          </div>

          <div className="relative h-[360px] w-96 overflow-hidden bg-neutral-50">
            {filters?.hrbp_id && (
              <div className="flex gap-2 overflow-x-auto border-b p-4 scrollbar-none">
                {!selectedHrbpsIsLoading &&
                  selectedHrbps &&
                  selectedHrbps.results.length > 0 &&
                  selectedHrbps.results.map((hrbp) => (
                    <div
                      key={hrbp.id}
                      className="flex cursor-pointer items-center gap-2 rounded-sm border border-neutral-400 bg-neutral-200 p-1 text-orange-600 transition-all ease-in-out hover:text-red-600"
                      onClick={() => onChange(hrbp.id)}
                    >
                      {`${hrbp.first_name} ${hrbp.last_name}`}
                      <span className="">
                        <MdClose />
                      </span>
                    </div>
                  ))}
              </div>
            )}
            <div className="border-b p-4">
              <Input
                name="Search"
                placeholder="Search HRBP"
                onChange={handleSearch}
              />
            </div>

            <div
              className={classNames(
                "flex gap-2 overflow-y-auto overflow-x-hidden capitalize",
                !filters?.hrbp_id ? "h-[280px]" : "h-64",
              )}
            >
              <div className="flex flex-1 flex-col gap-4 px-2">
                {!allHrbpssIsLoading &&
                  allHrbps &&
                  allHrbps.results.length > 0 &&
                  allHrbps.results
                    .filter(
                      (a) =>
                        !filters?.client_id
                          ?.split(",")
                          ?.includes(a.id.toString()),
                    )
                    .map((option) => (
                      <Checkbox
                        key={option.id}
                        label={`${option.first_name} ${option.last_name}`}
                        name={`${option.first_name} ${option.last_name}`}
                        checked={filters?.client_id
                          ?.split(",")
                          .includes(option.id.toString())}
                        onChange={() => onChange(option.id)}
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

export default HRBPFilter;
