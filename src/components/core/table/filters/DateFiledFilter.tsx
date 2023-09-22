/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import dayjs from "dayjs";
import { useState, type ChangeEvent } from "react";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { classNames } from "~/utils/classNames";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./StatusFilter";

const DateFiledFilter: React.FC<FilterProps> = ({
  column,
  isButtonHidden = false,
}) => {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const clearDates = () => {
    setDateFrom("");
    setDateTo("");
    column.setFilterValue(undefined);
  };

  const validate = () => {
    if (dateFrom !== "" && dateTo !== "") {
      const isBefore = dayjs(dateTo).isBefore(dayjs(dateFrom));
      const isSame = dayjs(dateTo).isSame(dayjs(dateTo));

      if (isBefore) {
        setError("Selected date range invalid!");
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

      const selectedDates = [dateFrom, dateTo];
      column.setFilterValue([
        selectedDates.map((a) => dayjs(a).format("MM/DD/YYYY")),
      ]);
    } else {
      const selectedDates = [dateFrom, dateTo];
      column.setFilterValue([
        selectedDates.map((a) => dayjs(a).format("MM/DD/YYYY")),
      ]);
    }
  };

  const onDateFromChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);

    // column.setFilterValue(
    //   selectedDates.map((a) => dayjs(a).format("MM/DD/YYYY")),
    // );
    // validate();
  };

  const onDateToChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
    // column.setFilterValue(
    //   selectedDates.map((a) => dayjs(a).format("MM/DD/YYYY")),
    // );
  };

  return (
    <Popover
      btn={
        <MdCalendarToday
          className={classNames(
            isButtonHidden && "hidden",
            "text-neutral-900 hover:text-neutral-800",
          )}
        />
      }
      content={
        <div className="w-64 p-4">
          <div className="flex flex-col gap-4 text-start">
            <Input
              type="date"
              name="from"
              label="From"
              defaultValue={dateFrom}
              onBlur={onDateFromChanged}
              hasErrors={hasErrors}
            />
            <Input
              type="date"
              name="to"
              label="To"
              defaultValue={dateTo}
              min={dayjs(dateFrom).add(1, "day").format("YYYY-MM-DD")}
              onBlur={onDateToChanged}
              hasErrors={hasErrors}
            />

            {hasErrors && error && (
              <p className="text-danger-default mt-1 text-sm">{error}</p>
            )}

            <CollapseHeightAnimation isVisible={dateFrom !== ""}>
              <div className="flex items-center justify-between">
                <Button buttonType="text" onClick={clearDates}>
                  Clear
                </Button>

                <Button onClick={validate}>Apply</Button>
              </div>
            </CollapseHeightAnimation>
          </div>
        </div>
      }
    />
  );
};

export default DateFiledFilter;
