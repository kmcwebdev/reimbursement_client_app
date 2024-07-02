import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { MdClose } from "react-icons-all-files/md/MdClose";
import ReferencesApiService from "~/app/api/services/references-service";
import { useSelectedClientsQuery } from "~/features/api/references-api-slice";
import { useDebounce } from "~/hooks/use-debounce";
import { classNames } from "~/utils/classNames";
import Popover from "../../Popover";
import SkeletonLoading from "../../SkeletonLoading";
import Checkbox from "../../form/fields/Checkbox";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./filter-props.type";

const ClientFilter: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const { data: selectedClients, isLoading: selectedClientsIsLoading } =
    useSelectedClientsQuery(
      { id: filters?.client_id },
      { skip: !filters?.client_id },
    );

  const [clientSearchValue, setClientSearchValue] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setClientSearchValue(searchValue);
  };

  const debouncedSearchText = useDebounce(clientSearchValue, 500);

  const {
    data: allClients,
    hasNextPage,
    isFetching: allClientsIsFetching,
    isLoading: allClientsIsLoading,
    fetchNextPage,
  } = ReferencesApiService.useAllClients({
    search: debouncedSearchText,
  });

  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (allClientsIsLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !allClientsIsFetching) {
          void fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, allClientsIsFetching, allClientsIsLoading],
  );

  const onChange = (value: number) => {
    let client_id: string | undefined = "";
    const currentClientFilters = filters?.client_id;

    if (currentClientFilters) {
      if (currentClientFilters.split(",").includes(value.toString())) {
        const filtered = currentClientFilters
          .split(",")
          .filter((a) => a !== value.toString());

        if (filtered.length === 0) {
          client_id = undefined;
        } else {
          client_id = filtered.join(",");
        }
      } else {
        client_id = currentClientFilters + "," + value.toString();
      }
    } else {
      client_id = value.toString();
    }

    setFilters({
      ...filters,
      page: undefined,
      client_id,
    });
  };

  return (
    <Popover
      ariaLabel="Client Filter"
      panelClassName="-translate-x-[89%]"
      btn={<FaCaretDown className="text-neutral-900 hover:text-neutral-800" />}
      content={
        <div className="flex flex-col">
          <div className="flex h-10 items-center border-b px-4 text-orange-600">
            Pick Client/s
          </div>
          <div className="relative h-60 w-64 overflow-y-hidden bg-neutral-50">
            {filters?.client_id && (
              <div className="flex h-10 gap-2 overflow-x-auto border-b p-2 scrollbar-none">
                {!selectedClientsIsLoading &&
                  selectedClients &&
                  selectedClients.results.length > 0 &&
                  selectedClients.results.map((client) => (
                    <div
                      key={client.id}
                      className="flex cursor-pointer items-center gap-2 rounded-sm border border-neutral-400 bg-neutral-200 p-1 text-orange-600 transition-all ease-in-out hover:text-red-600"
                      onClick={() => onChange(client.id)}
                    >
                      {client.name}
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
                placeholder="Search Client"
                onChange={handleSearch}
              />
            </div>

            <div
              className={classNames(
                "flex gap-2 overflow-y-auto overflow-x-hidden py-4 capitalize",
                !filters?.client_id ? "h-[188px]" : "h-[148px]",
              )}
            >
              <div className="flex flex-1 flex-col gap-4 px-2 pb-4">
                {allClients &&
                  allClients.pages?.length > 0 &&
                  allClients.pages.map(
                    (page) =>
                      page.results.length > 0 &&
                      page.results
                        .filter(
                          (a) =>
                            !filters?.client_id
                              ?.split(",")
                              ?.includes(a.id.toString()),
                        )
                        .map((option) => (
                          <div ref={lastElementRef} key={option.id}>
                            <Checkbox
                              label={option.name}
                              name={option.name}
                              checked={filters?.client_id
                                ?.split(",")
                                .includes(option.id.toString())}
                              onChange={() => onChange(option.id)}
                            />
                          </div>
                        )),
                  )}

                {allClientsIsFetching &&
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

export default ClientFilter;
