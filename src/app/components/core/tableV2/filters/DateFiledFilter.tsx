/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useMemo, useState, type ChangeEvent } from "react";
import { MdCalendarToday } from "react-icons-all-files/md/MdCalendarToday";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { parseTimezone } from "~/utils/parse-timezone";
import { Button } from "../../Button";
import Popover from "../../Popover";
import Input from "../../form/fields/Input";
import { type FilterProps } from "./filter-props.type";
dayjs.extend(utc);

const DateFiledFilter: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const [createdAfter, setCreatedAfter] = useState<string | undefined>(
    undefined,
  );
  const [createdBefore, setCreatedBefore] = useState<string | undefined>(
    undefined,
  );
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useMemo(() => {
    if (filters?.created_at_before) {
      setCreatedBefore(dayjs(filters?.created_at_before).format("YYYY-MM-DD"));
    } else {
      setCreatedBefore(undefined);
    }

    if (filters?.created_at_after) {
      setCreatedAfter(dayjs(filters?.created_at_after).format("YYYY-MM-DD"));
    } else {
      setCreatedAfter(undefined);
    }
  }, [filters?.created_at_before, filters?.created_at_after]);

  const clearDates = () => {
    setCreatedBefore(undefined);
    setCreatedAfter(undefined);

    setFilters({
      ...filters,
      page: undefined,
      created_at_before: undefined,
      created_at_after: undefined,
    });
  };

  const validate = () => {
    if (createdAfter && createdBefore) {
      const isBefore = dayjs
        .utc(createdBefore)
        .isBefore(dayjs.utc(createdAfter));
      const isSame = dayjs.utc(createdAfter).isSame(dayjs.utc(createdBefore));

      if (createdBefore && isBefore) {
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

      setFilters({
        ...filters,
        created_at_after:
          createdAfter && parseTimezone(createdAfter).format("YYYY-MM-DD"),
        created_at_before:
          createdBefore && parseTimezone(createdBefore).format("YYYY-MM-DD"),
      });
    } else {
      setFilters({
        ...filters,
        created_at_after:
          createdAfter && parseTimezone(createdAfter).format("YYYY-MM-DD"),
        created_at_before:
          createdBefore && parseTimezone(createdBefore).format("YYYY-MM-DD"),
      });
    }
  };

  const onDateFromChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setCreatedAfter(e.target.value);

    if (!createdBefore) {
      setCreatedBefore(
        dayjs(e.target.value).add(5, "days").format("YYYY-MM-DD"),
      );
    }
  };

  const onDateToChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setCreatedBefore(e.target.value);
  };

  return (
    <Popover
      ariaLabel="Calendar"
      panelClassName="-translate-x-3/4 md:translate-x-0"
      btn={
        <MdCalendarToday className="text-neutral-900 hover:text-neutral-800" />
      }
      content={
        <div className="flex  flex-col">
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
                  createdAfter ? dayjs(createdAfter).format("YYYY-MM-DD") : ""
                }
                onBlur={onDateFromChanged}
                hasErrors={hasErrors}
              />
              <Input
                type="date"
                name="to"
                label="To"
                defaultValue={
                  createdBefore ? dayjs(createdBefore).format("YYYY-MM-DD") : ""
                }
                min={
                  createdAfter
                    ? dayjs(createdAfter).add(1, "day").format("YYYY-MM-DD")
                    : ""
                }
                onBlur={onDateToChanged}
                hasErrors={hasErrors}
              />

              {hasErrors && error && (
                <p className="text-danger-default mt-1 text-sm">{error}</p>
              )}

              <CollapseHeightAnimation isVisible={!!createdBefore}>
                <div className="flex items-center justify-between">
                  <Button
                    aria-label="Clear"
                    buttonType="text"
                    onClick={clearDates}
                  >
                    Clear
                  </Button>

                  <Button aria-label="Apply" onClick={validate}>
                    Apply
                  </Button>
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
