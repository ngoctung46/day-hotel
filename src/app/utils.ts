import { DateRange } from './models/date-range';
import { TimeDiff } from './models/time-diff';

export class Utils {
  static getCurrentDateRange(): DateRange {
    const from: Date = new Date(Date.now());
    const to: Date = new Date(Date.now());
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
}
