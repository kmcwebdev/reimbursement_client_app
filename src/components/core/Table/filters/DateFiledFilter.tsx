/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import dayjs from "dayjs";
import { useEffect, useState, type ChangeEvent } from "react";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./StatusFilter";

const DateFiledFilter: React.FC<FilterProps> = ({
  column, // table,
}) => {
  useEffect(() => {
    column.setFilterValue(undefined);
  }, [column]);

  useEffect(() => {
    const filterValue = column.getFilterValue();

    if (filterValue === undefined) {
      clearDates();
      column.setFilterValue(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFilterValue()]);

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const clearDates = () => {
    setSelectedDates([]);
    column.setFilterValue(undefined);
  };

  const validate = () => {
    if (selectedDates) {
      if (selectedDates.length === 2) {
        const isBefore = dayjs(selectedDates[1]).isBefore(
          dayjs(selectedDates[0]),
        );
        const isSame = dayjs(selectedDates[1]).isSame(dayjs(selectedDates[0]));

        if (isBefore) {
          setError("To must not be before From!");
          setHasErrors(true);
          return;
        }

        if (isSame) {
          setError("Selected dates must not be same!");
          setHasErrors(true);
          return;
        }

        setHasErrors(false);
        setError(undefined);

        column.setFilterValue(
          selectedDates.map((a) => dayjs(a).format("MM/DD/YYYY")),
        );
      } else {
        column.setFilterValue(
          selectedDates.map((a) => dayjs(a).format("MM/DD/YYYY")),
        );
      }
    } else {
      column.setFilterValue(undefined);
    }
  };

  const onDateFromChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const selectedDatesCopy = selectedDates;

    if (selectedDatesCopy && value) {
      if (selectedDatesCopy.length >= 1) {
        console.log("a");
        selectedDatesCopy[0] = value;
        setSelectedDates(selectedDatesCopy);
      }
      if (selectedDatesCopy.length === 0) {
        selectedDatesCopy.push(value);
        setSelectedDates(selectedDatesCopy);
      }
    }
    validate();
  };

  const onDateToChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const selectedDatesCopy = selectedDates;

    if (selectedDatesCopy && selectedDatesCopy.length === 2) {
      console.log("here");
      selectedDatesCopy[1] = value;
    } else if (selectedDatesCopy && selectedDatesCopy.length < 2) {
      selectedDatesCopy.push(value);
    }

    setSelectedDates(selectedDatesCopy);

    validate();
  };

  return (
    <Popover
      btn={<MdCalendarToday />}
      content={
        <div className="w-64 p-4">
          <div className="flex flex-col gap-4 text-start">
            <Input
              type="date"
              name="from"
              label="From"
              value={selectedDates[0] || ""}
              onChange={onDateFromChanged}
              hasErrors={hasErrors}
            />
            <Input
              type="date"
              name="to"
              label="To"
              value={
                selectedDates && selectedDates.length > 1
                  ? selectedDates[1]
                  : ""
              }
              disabled={!selectedDates || selectedDates.length === 0}
              min={
                selectedDates && selectedDates.length > 0
                  ? dayjs(selectedDates[0]).add(1, "day").format("YYYY-MM-DD")
                  : ""
              }
              onChange={onDateToChanged}
              hasErrors={hasErrors}
            />

            {hasErrors && error && (
              <p className="mt-1 text-sm text-danger-default">{error}</p>
            )}

            <CollapseHeightAnimation
              isVisible={(selectedDates && selectedDates.length !== 0) ?? false}
            >
              <Button buttonType="text" onClick={clearDates}>
                Clear
              </Button>
            </CollapseHeightAnimation>
          </div>
        </div>
      }
    />
  );
};

export default DateFiledFilter;
