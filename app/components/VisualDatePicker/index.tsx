import { PureComponent } from 'react';
import XDate from './XDate';

export interface VisualDatePickerProps {
  value?: number;
  onValueChange: (value: number) => void;
  start?: number;
  end?: number;
}
function tString(v: number | string): string {
  v = v.toString();
  return v.length < 2 ? '0' + v : v;
}

export class VisualDatePicker<
  T extends VisualDatePickerProps
> extends PureComponent<T> {
  static defaultProps = {
    start: new Date(1900, 0, 1).getTime(),
    end: new Date(2100, 0, 1).getTime()
  };
  date = new XDate();
  constructor(props: Props) {
    super(props);
    const value = new XDate(props.value);
    this.date = value;
  }
  componentDidUpdate(prevProps: VisualDatePickerProps) {
    if (prevProps.value !== this.props.value) {
      this.date = new XDate(this.props.value);
      this.forceUpdate();
    }
  }

  today() {
    return new XDate();
  }
  setFullYear(y: number) {
    this.date.setFullYear(y);
    this.forceUpdate();
  }
  setDate(d: number) {
    this.date.setDate(d);
    this.forceUpdate();
  }
  setMonth(m: number) {
    this.date.setMonth(m);
    this.forceUpdate();
  }
  setHours(h: number) {
    this.date.setHours(h);
    this.forceUpdate();
  }
  setMinutes(m: number) {
    this.date.setMinutes(m);
    this.forceUpdate();
  }
  setSeconds(s: number) {
    this.date.setSeconds(s);
    this.forceUpdate();
  }
  setMilliseconds(ms: number) {
    this.date.setMilliseconds(ms);
    this.forceUpdate();
  }
  nextMonth() {
    return this.date.getMonth() + 1;
  }
  nextDate() {
    return this.date.getDate() + 1;
  }
  nextYear() {
    return this.date.getFullYear() + 1;
  }
  preYear() {
    return this.date.getFullYear() - 1;
  }
  preDate() {
    return this.date.getDate() - 1;
  }
  preMonth() {
    return this.date.getMonth() - 1;
  }
  maxYear() {
    return new Date(this.props.end).getFullYear();
  }
  minYear() {
    return new Date(this.props.start).getFullYear();
  }
  maxMonth(year: number) {
    const e = new Date(this.props.end);
    const y = e.getFullYear();
    if (y === year) {
      return e.getMonth() + 1;
    } else if (y < year) {
      return -1;
    } else {
      return 12;
    }
  }
  minMonth(year: number) {
    const s = new Date(this.props.start);
    const y = s.getFullYear();
    if (y === year) {
      return s.getMonth() + 1;
    } else if (y > year) {
      return -1;
    } else {
      return 1;
    }
  }
  maxDate(year: number, month: number) {
    const e = new XDate(this.props.end);
    const y = e.getFullYear();
    const m = e.getMonth() + 1;
    if (y === year && m === month) {
      return e.getDate();
    } else if (y < year || (y === year && m < month)) {
      return -1;
    } else {
      return new XDate(year, month - 1).daysOfMonth();
    }
  }
  minDate(year: number, month: number) {
    const s = new XDate(this.props.start);
    const y = s.getFullYear();
    const m = s.getMonth() + 1;
    if (y === year && m === month) {
      return s.getDate();
    } else if (y > year || (y === year && m > month)) {
      return -1;
    } else {
      return 1;
    }
  }
  isValidDate(date: Date) {
    const { start = 0, end = 0 } = this.props;
    return date.getTime() >= start && date.getTime() < end;
  }
  select() {
    this.props.onValueChange && this.props.onValueChange(this.date.getTime());
  }
  format(patten: string) {
    const value = this.date;
    return XDate.format(patten, value);
  }
}
