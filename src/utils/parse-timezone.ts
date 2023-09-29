import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(timezone);
dayjs.extend(utc);

export const parseTimezone =(dateString: string) => {
  const timezone = dayjs.tz.guess();
  return dayjs.utc(dateString).tz(timezone);
}