/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useMemo, useState } from "react";
import { FaCaretDown } from "react-icons-all-files/fa/FaCaretDown";
import { type PropsValue } from "react-select";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Select, { type OptionData } from "../../form/fields/Select";
import { type FilterProps } from "./StatusFilter";

const ClientFilter: React.FC<FilterProps> = ({
  column, // table,
}) => {
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort() as string[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [column.getFacetedUniqueValues()],
  );

  useEffect(() => {
    column.setFilterValue(sortedUniqueValues);
  }, [column, sortedUniqueValues]);

  const [checked, setChecked] = useState<PropsValue<OptionData>>(
    sortedUniqueValues.map((a) => ({ label: a, value: a })),
  );

  const onChange = (e: PropsValue<OptionData>) => {
    setChecked(e);
    if (Array.isArray(e)) {
      const sorted = e.map((a) => a.value as string);
      column.setFilterValue(sorted);
    }
  };

  const showAll = () => {
    onChange(sortedUniqueValues.map((a) => ({ label: a, value: a })));
    column.setFilterValue(sortedUniqueValues);
  };

  return (
    <Popover
      btn={<FaCaretDown />}
      content={
        <div className="w-80 p-4">
          <div className="flex flex-col gap-2">
            <Select
              name="clientFilter"
              options={sortedUniqueValues.map((a) => ({ label: a, value: a }))}
              initialValue={checked}
              isMulti
              onChangeEvent={onChange}
            />

            <CollapseHeightAnimation
              isVisible={
                Array.isArray(checked) &&
                checked.length < sortedUniqueValues.length
              }
            >
              <Button buttonType="text" onClick={showAll}>
                Show All
              </Button>
            </CollapseHeightAnimation>
          </div>
        </div>
      }
    />
  );
};

export default ClientFilter;
