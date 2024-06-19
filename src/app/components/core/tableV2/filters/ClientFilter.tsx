import { useState, type ChangeEvent } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { useAllClientsQuery } from "~/features/api/references-api-slice";
import { useDebounce } from "~/hooks/use-debounce";
import Popover from "../../Popover";
import Checkbox from "../../form/fields/Checkbox";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./filter-props.type";

const ClientFilter: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const { data: selectedClients, isLoading: selectedClientsIsLoading } =
    useAllClientsQuery(
      { id: filters?.client_id },
      { skip: !filters?.client_id },
    );

  const [clientSearchValue, setClientSearchValue] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setClientSearchValue(searchValue);
  };

  const debouncedSearchText = useDebounce(clientSearchValue, 500);
  const { data: allClients, isLoading: allClientsIsLoading } =
    useAllClientsQuery(
      { search: debouncedSearchText, page_size: 100 },
      {
        refetchOnMountOrArgChange: true,
      },
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
      ariaLabel="Expense Type"
      panelClassName="-translate-x-1/4 md:translate-x-0"
      btn={<FaCaretDown className="text-neutral-900 hover:text-neutral-800" />}
      content={
        <div className="flex flex-col">
          <div className="flex h-10 items-center border-b px-4 text-orange-600">
            Pick Client/s
          </div>
          <div className="relative h-[360px] w-96 overflow-y-hidden bg-neutral-50">
            {filters?.client_id && (
              <div className="flex gap-2 overflow-x-auto border-b p-4 scrollbar-none">
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

            <div className="border-b p-4">
              <Input
                name="Search"
                placeholder="Search Client"
                onChange={handleSearch}
              />
            </div>

            <div className="flex h-64 gap-2 overflow-y-auto capitalize">
              <div className="flex flex-1 flex-col gap-4 p-2">
                {!allClientsIsLoading &&
                  allClients &&
                  allClients.results.length > 0 &&
                  allClients.results
                    .filter(
                      (a) =>
                        !filters?.client_id
                          ?.split(",")
                          ?.includes(a.id.toString()),
                    )
                    .map((option) => (
                      <Checkbox
                        key={option.id}
                        label={option.name}
                        name={option.name}
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

export default ClientFilter;
