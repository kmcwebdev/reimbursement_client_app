import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { MdClose } from "react-icons-all-files/md/MdClose";
import ReferencesApiService from "~/app/api/services/references-service";
import { useSelectedHRBPsQuery } from "~/features/api/references-api-slice";
import { useDebounce } from "~/hooks/use-debounce";
import { classNames } from "~/utils/classNames";
import Popover from "../../Popover";
import SkeletonLoading from "../../SkeletonLoading";
import Checkbox from "../../form/fields/Checkbox";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./filter-props.type";

const HRBPFilter: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const { data: selectedHrbps, isLoading: selectedHrbpsIsLoading } =
    useSelectedHRBPsQuery(
      { id: filters?.hrbp_id },
      { skip: !filters?.hrbp_id },
    );

  const [hrbpSearchValue, setHRBPSearchValue] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setHRBPSearchValue(searchValue);
  };

  const debouncedSearchText = useDebounce(hrbpSearchValue, 500);
  const {
    data: allHrbps,
    hasNextPage,
    isFetching: allHrbpsIsFetching,
    isLoading: allHrbpsIsLoading,
    fetchNextPage,
  } = ReferencesApiService.useAllHrbps({
    search: debouncedSearchText,
  });

  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (allHrbpsIsLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !allHrbpsIsFetching) {
          void fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, allHrbpsIsLoading, allHrbpsIsFetching],
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
      panelClassName="-translate-x-[55%] md:-translate-x-[89%]"
      btn={<FaCaretDown className="text-neutral-900 hover:text-neutral-800" />}
      content={
        <div className="flex flex-col">
          <div className="flex h-10 items-center border-b px-4 text-orange-600">
            Pick HRBP/s
          </div>

          <div className="relative h-60 w-64 overflow-hidden bg-neutral-50">
            {filters?.hrbp_id && (
              <div className="flex h-10 gap-2 overflow-x-auto border-b p-2 scrollbar-none">
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
            <div className="h-[50px] border-b p-2 md:px-4 md:py-2">
              <Input
                className="text-xs md:text-sm"
                name="Search"
                placeholder="Search HRBP"
                onChange={handleSearch}
              />
            </div>

            <div
              className={classNames(
                "flex gap-2 overflow-y-auto overflow-x-hidden capitalize",
                !filters?.hrbp_id ? "h-[188px]" : "h-[148px]",
              )}
            >
              <div className="flex flex-1 flex-col gap-4 px-2">
                {allHrbps &&
                  allHrbps.pages?.length > 0 &&
                  allHrbps.pages.map(
                    (page) =>
                      page.results.length > 0 &&
                      page.results
                        .filter(
                          (a) =>
                            !filters?.hrbp_id
                              ?.split(",")
                              ?.includes(a.id.toString()),
                        )
                        .map((option) => (
                          <div ref={lastElementRef} key={option.id}>
                            <Checkbox
                              label={
                                <div className="block w-48 truncate text-left">
                                  {option.first_name} {option.last_name}
                                </div>
                              }
                              name={`${option.first_name} ${option.last_name}`}
                              checked={filters?.hrbp_id
                                ?.split(",")
                                .includes(option.id.toString())}
                              onChange={() => onChange(option.id)}
                            />
                          </div>
                        )),
                  )}

                {allHrbpsIsFetching &&
                  Array.from({ length: 10 }).map((_a, i) => (
                    <div key={i} className="flex flex-1 gap-4">
                      <SkeletonLoading className="h-5 w-5 rounded-md" />
                      <SkeletonLoading className="h-5 w-48 rounded-md" />
                    </div>
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
