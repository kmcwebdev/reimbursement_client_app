import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);

export const parseTimezone = (dateString: string) => {
  // dayjs.tz.setDefault('');

  console.log("TIMEZONE", timezone);
  return dayjs.utc(dateString).tz("Asia/Manila");
};
