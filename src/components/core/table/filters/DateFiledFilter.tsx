/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import dayjs from "dayjs";
import { useState, type ChangeEvent } from "react";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { setPageTableFilters } from "~/features/page-state.slice";
import parseZone from "~/utils/parseZone";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./StatusFilter";

dayjs.extend(parseZone);

const DateFiledFilter: React.FC<FilterProps> = () => {
  const { filters } = useAppSelector((state) => state.pageTableState);

  const dispatch = useAppDispatch();
  const [dateFrom, setDateFrom] = useState<string | undefined>(filters.from);
  const [dateTo, setDateTo] = useState<string | undefined>(filters.to);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const clearDates = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    dispatch(
      setPageTableFilters({
        ...filters,
        from: undefined,
        to: undefined,
      }),
    );
  };

  const validate = () => {
    if (dateFrom !== "" && dateTo !== "") {
      const isBefore = dayjs(dateTo).isBefore(dayjs(dateFrom));
      const isSame = dayjs(dateFrom).isSame(dayjs(dateTo));

      if (dateTo && isBefore) {
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

      dispatch(
        setPageTableFilters({
          ...filters,
          from: dateFrom && dayjs(dateFrom).toISOString(),
          to: dateTo && dayjs(dateTo).toISOString(),
        }),
      );
    } else {
      dispatch(
        setPageTableFilters({
          ...filters,
          from: dayjs(dateFrom).toISOString(),
          to: dayjs(dateTo).toISOString(),
        }),
      );
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
        <MdCalendarToday className="text-neutral-900 hover:text-neutral-800" />
      }
      content={
        <div className="w-64 p-4">
          <div className="flex flex-col gap-4 text-start">
            <Input
              type="date"
              name="from"
              label="From"
              onBlur={onDateFromChanged}
              hasErrors={hasErrors}
            />
            <Input
              type="date"
              name="to"
              label="To"
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
