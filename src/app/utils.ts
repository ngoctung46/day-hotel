import { DateRange } from './models/date-range';
import { TimeDiff } from './models/time-diff';

export class Utils {
  static getCurrentDateRange(step = 0): DateRange {
    const from: Date = new Date(Date.now());
    from.setDate(from.getDate() - step);
    const to: Date = new Date(Date.now());
    to.setDate(to.getDate() + step);
    if (to.getHours() <= 12) {
      from.setDate(from.getDate() - 1);
      from.setHours(12, 0, 0);
      to.setHours(12, 0, 0);
    } else {
      to.setDate(to.getDate() + 1);
      to.setHours(12, 0, 0);
      from.setHours(12, 0, 0);
    }
    return { fromDate: from, toDate: to } as DateRange;
  }
  static getTimeDiff(checkInTime: number): TimeDiff {
    const now = new Date().getTime();
    const timeDiff = now - checkInTime;
    const seconds = Math.trunc(timeDiff / 1000);
    const minutes = Math.trunc(seconds / 60);
    const hours = Math.trunc(minutes / 60);
    const days = Math.trunc(hours / 24);
    return {
      days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
      totalHours: hours,
    };
  }
  static dateToStr(date_Object: Date): string {
    // get the year, month, date, hours, and minutes seprately and append to the string.
    let month = date_Object.getMonth() + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr =
      date_Object.getDate() < 10
        ? `0${date_Object.getDate()}`
        : `${date_Object.getDate()}`;
    const hourStr =
      date_Object.getHours() < 10
        ? `0${date_Object.getHours()}`
        : `${date_Object.getHours()}`;
    const minutesStr =
      date_Object.getMinutes() < 10
        ? `0${date_Object.getMinutes()}`
        : `${date_Object.getMinutes()}`;

    let date_String: string =
      date_Object.getFullYear() +
      '-' +
      monthStr +
      '-' +
      dayStr +
      'T' +
      hourStr +
      ':' +
      minutesStr;
    return date_String;
  }
}
