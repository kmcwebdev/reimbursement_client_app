import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);

export const parseTimezone = (dateString: string) => {
  const defaultTimezone = "Asia/Manila";
  return dayjs.utc(dateString).tz(defaultTimezone);
};
