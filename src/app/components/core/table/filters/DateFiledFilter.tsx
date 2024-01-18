/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo, useState, type ChangeEvent } from "react";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setPageTableFilters } from "~/features/state/table-state.slice";
import { parseTimezone } from "~/utils/parse-timezone";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./StatusFilter";
dayjs.extend(utc);

const DateFiledFilter: React.FC<FilterProps> = () => {
  const { filters } = useAppSelector((state) => state.pageTableState);

  const dispatch = useAppDispatch();
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useMemo(() => {
    if (filters.created_at_before) {
      setDateFrom(dayjs(filters.created_at_before).format("YYYY-MM-DD"));
    } else {
      setDateFrom(undefined);
    }

    if (filters.created_at_after) {
      setDateTo(dayjs(filters.created_at_after).format("YYYY-MM-DD"));
    } else {
      setDateTo(undefined);
    }
  }, [filters.created_at_before, filters.created_at_after]);

  const clearDates = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    dispatch(
      setPageTableFilters({
        ...filters,
        page: undefined,
        created_at_before: undefined,
        created_at_after: undefined,
      }),
    );
  };

  const validate = () => {
    if (dateFrom && dateTo) {
      const isBefore = dayjs.utc(dateTo).isBefore(dayjs.utc(dateFrom));
      const isSame = dayjs.utc(dateFrom).isSame(dayjs.utc(dateTo));

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
          created_at_after:
            dateFrom && parseTimezone(dateFrom).format("YYYY-MM-DD"),
          created_at_before:
            dateTo && parseTimezone(dateTo).format("YYYY-MM-DD"),
        }),
      );
    } else {
      dispatch(
        setPageTableFilters({
          ...filters,
          created_at_after:
            dateFrom && parseTimezone(dateFrom).format("YYYY-MM-DD"),
          created_at_before:
            dateTo && parseTimezone(dateTo).format("YYYY-MM-DD"),
        }),
      );
    }
  };

  const onDateFromChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setDateFrom(e.target.value);

    if (!dateTo) {
      setDateTo(dayjs(e.target.value).add(5, "days").format("YYYY-MM-DD"));
    }
  };

  const onDateToChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setDateTo(e.target.value);
  };

  return (
    <Popover
      btn={
        <MdCalendarToday className="text-neutral-900 hover:text-neutral-800" />
      }
      content={
        <div className="flex flex-col">
          <div className="flex h-10 items-center border-b px-4 text-orange-600">
            Pick Dates
          </div>
          <div className="w-64 bg-neutral-50 p-4">
            <div className="flex flex-col gap-4 text-start">
              <Input
                type="date"
                name="from"
                label="From"
                defaultValue={
                  dateFrom ? dayjs(dateFrom).format("YYYY-MM-DD") : ""
                }
                onBlur={onDateFromChanged}
                hasErrors={hasErrors}
              />
              <Input
                type="date"
                name="to"
                label="To"
                defaultValue={dateTo ? dayjs(dateTo).format("YYYY-MM-DD") : ""}
                min={
                  dateFrom
                    ? dayjs(dateFrom).add(1, "day").format("YYYY-MM-DD")
                    : ""
                }
                onBlur={onDateToChanged}
                hasErrors={hasErrors}
              />

              {hasErrors && error && (
                <p className="text-danger-default mt-1 text-sm">{error}</p>
              )}

              <CollapseHeightAnimation isVisible={!!dateFrom}>
                <div className="flex items-center justify-between">
                  <Button buttonType="text" onClick={clearDates}>
                    Clear
                  </Button>

                  <Button onClick={validate}>Apply</Button>
                </div>
              </CollapseHeightAnimation>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default DateFiledFilter;
