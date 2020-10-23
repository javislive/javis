// switch (match) {
//   case 'yy':
//     return date.getFullYear().toString();
//   case 'yyyy':
//     return date.getFullYear();
// }

function tString(v: number | string) {
  v = v.toString();
  return v.length < 2 ? '0' + v : v;
}

export default class XDate extends Date {
  static format(patten: string, date: Date) {
    const y = date.getFullYear();
    const M = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const ms = date.getMilliseconds();
    return patten.replace(/\w+/g, match => {
      switch (match) {
        case 'yy':
          return y.toString().slice(-2);
        case 'yyyy':
          return y;
        case 'M':
          return M;
        case 'MM':
          return tString(M);
        case 'd':
          return d;
        case 'dd':
          return tString(d);
        case 'h':
          return h > 12 ? h - 12 : h;
        case 'hh':
          return tString(h);
        case 'm':
          return m;
        case 'mm':
          return tString(m);
        case 's':
          return s;
        case 'ss':
          return tString(s);
        default:
          return match;
      }
    });
  }
  format(patten: string = 'yyyy-MM-dd') {
    return XDate.format(patten, this);
  }
  isDateSame(date: Date): boolean {
    return (
      date.getFullYear() === this.getFullYear() &&
      date.getMonth() === this.getMonth() &&
      date.getDate() === this.getDate()
    );
  }
  between(startDate: Date, endDate: Date): boolean {
    return (
      startDate.getTime() <= this.getTime() &&
      this.getTime() <= endDate.getTime()
    );
  }
  daysOfMonth(): number {
    const y = this.getFullYear();
    const m = this.getMonth();
    return new Date(new Date(y, m + 1, 1).getTime() - 1).getDate();
  }
  firstDayOfMonth(): number {
    const y = this.getFullYear();
    const m = this.getMonth();
    return new Date(y, m, 1).getDay();
  }
  lastDayOfMonth(): number {
    const y = this.getFullYear();
    const m = this.getMonth();
    const d = new Date(y, m + 1, 1).getDay() - 1;
    return d < 0 ? 6 : d;
  }
  daysAwayFrom(endDate: Date): number {
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const start = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    return Math.ceil((end.getTime() - start.getTime()) / 86400000);
  }
  nextMonth() {
    let m = this.getMonth();
    let y = this.getFullYear();
    if (m == 11) {
      y++;
      m = 0;
    } else {
      m++;
    }
    this.setFullYear(y);
    this.setMonth(m);
  }
  nextDate() {
    const daysOfMonth = this.daysOfMonth();
    const d = this.getDate();
    if (d + 1 > daysOfMonth) {
      this.setDate(1);
      this.nextMonth();
    } else {
      this.setDate(d + 1);
    }
  }
  isToday(): boolean {
    return this.isDateSame(new Date());
  }
  preYear() {
    this.setFullYear(this.getFullYear() - 1);
    return this;
  }
  nextYear() {
    this.setFullYear(this.getFullYear() + 1);
    return this;
  }
  firstDateOfYear() {
    this.setTime(new Date(this.getFullYear(), 0, 1).getTime());
    return this;
  }
  copy() {
    return new XDate(this.getTime());
  }
}
