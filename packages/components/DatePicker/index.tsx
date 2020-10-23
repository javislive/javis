import React, { PureComponent } from 'react';
import { View, Text } from 'react-native-ui';
import Picker from 'components/Picker';
import { createStyle } from 'themes';
import { vm, vh } from 'utils/resize';
import DateTable from './DateTable';
import DateList from './DateList';

interface Props {
  value?: number;
  start?: number;
  end?: number;
  onValueChange?: (value: number) => void;
}

class DatePicker extends PureComponent<Props> {
  state = {};
  render() {
    let { value } = this.props;
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return (
      <View style={styles.dateWrapper}>
        <Picker
          selectedValue={year}
          onValueChange={(v: any) => this._onValueChange('year', v)}
          style={styles.datePicker}
        >
          {this._renderYear(year)}
        </Picker>
        <Picker
          selectedValue={month}
          onValueChange={(v: any) => this._onValueChange('month', v)}
          style={styles.datePicker}
        >
          {this._renderMoon(year, month)}
        </Picker>
        <Picker
          selectedValue={day}
          onValueChange={(v: any) => this._onValueChange('date', v)}
          style={styles.datePicker}
        >
          {this._renderDate(year, month, day)}
        </Picker>
      </View>
    );
  }
  _onValueChange = (type: string, value: any) => {
    let { value: v } = this.props;
    let changedValue = new Date(v);
    switch (type) {
      case 'year':
        changedValue.setFullYear(value);
        break;
      case 'date':
        changedValue.setDate(value);
        break;
      case 'month':
        changedValue.setMonth(value);
        break;
    }
    this.props.onValueChange &&
      this.props.onValueChange(changedValue.getTime());
  };
  _renderYear(year: string) {
    let { start, end } = this.props;
    let startYear = start ? new Date(start).getFullYear() : 1900;
    const endYear = end ? new Date(end).getFullYear() : 2100;
    const children: Picker.item[] = [];
    for (; startYear <= endYear; startYear++) {
      children.push(
        <Picker.Item key={startYear} label={startYear + ''} value={startYear} />
      );
    }
    return children;
  }
  _renderMoon(year: number, moon: number) {
    const { start, end } = this.props;
    const startDate = start ? new Date(start) : new Date(1900, 0, 1);
    const endDate = end ? new Date(end) : new Date(2100, 11, 31);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    let startMonth = startYear == year ? startDate.getMonth() : 0;
    const endMonth = endYear == year ? endDate.getMonth() : 11;
    const children: Picker.item[] = [];
    for (; startMonth <= endMonth; startMonth++) {
      children.push(
        <Picker.Item
          key={startMonth}
          label={startMonth + 1 + ''}
          value={startMonth}
        />
      );
    }
    return children;
  }
  _renderDate(year: number, moon: number, date: number) {
    const { start, end } = this.props;
    const startDate = start ? new Date(start) : new Date(1900, 0, 1);
    const endDate = end ? new Date(end) : new Date(2100, 11, 31);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    let startDay, endDay;
    if (startYear == year && startDate.getMonth() + 1 == moon) {
      startDay = startDate.getDate();
    } else {
      startDay = 1;
    }
    if (endYear == year && endDate.getMonth() + 1 == moon) {
      endDay = endDate.getDate();
    } else {
      let current = new Date(year, moon, 1).getTime();
      let end = new Date(year, moon + 1, 1).getTime();
      endDay = Math.ceil((end - current) / 86400000);
    }
    const children: Picker.item[] = [];
    for (; startDay <= endDay; startDay++) {
      children.push(
        <Picker.Item key={startDay} label={startDay + ''} value={startDay} />
      );
    }
    return children;
  }
}

const styles = createStyle(theme => {
  return {
    dateWrapper: {
      // height: vh(40),
      flexDirection: 'row'
    },
    datePicker: {
      flex: 1
    }
  };
});

export { DatePicker, DateTable, DateList };
export default DateList;
