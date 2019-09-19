import React, { ReactElement } from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui';

import FontIcon from 'components/FontIcon';
import { VisualDatePicker } from 'components/VisualDatePicker';
import XDate from 'components/VisualDatePicker/XDate';
import { createStyle } from 'themes';
import { vw } from 'utils/resize';

class DateTable extends VisualDatePicker {
  state = {
    stage: 'date'
  };
  render() {
    return (
      <View style={styles.wrapper}>
        {this._renderHeader()}
        {this._renderContent()}
      </View>
    );
  }
  _renderHeader() {
    const {
      state: { stage },
      date
    } = this;
    const year = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    let children = null;
    switch (stage) {
      case 'year':
        children = (
          <View style={styles.yearHeader}>
            <Text style={styles.yearHeaderText}>
              {Math.max(year - 5, this.minYear())}
            </Text>
            <View style={styles.divide} />
            <Text style={styles.yearHeaderText}>
              {Math.min(year + 5, this.maxYear())}
            </Text>
          </View>
        );
        break;
      case 'month':
        children = (
          <View style={styles.monthHeader}>
            <TouchableOpacity
              style={styles.monthHeaderCell}
              onPress={() => {
                this.setState({ stage: 'year' });
              }}
            >
              <Text style={styles.monthHeaderText}>{year}年</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case 'date':
        children = (
          <View style={styles.dateHeader}>
            <TouchableOpacity
              style={styles.dateHeaderYear}
              onPress={() => {
                this.setState({ stage: 'year' });
              }}
            >
              <Text>{year}年</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateHeaderMonth}
              onPress={() => {
                this.setState({ stage: 'month' });
              }}
            >
              <Text>{m}月</Text>
            </TouchableOpacity>
          </View>
        );
        break;
    }
    return (
      <View style={styles.header}>
        <View>
          <TouchableOpacity style={styles.headerButton} onPress={this._pre}>
            <FontIcon icon="&#xe857;" />
          </TouchableOpacity>
        </View>
        {children}
        <View>
          <TouchableOpacity style={styles.headerButton} onPress={this._next}>
            <FontIcon icon="&#xe856;" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  _renderContent() {
    const {
      state: { stage }
    } = this;
    let children = null;
    switch (stage) {
      case 'year':
        children = this._renderYear();
        break;
      case 'month':
        children = this._renderMonth();
        break;
      case 'date':
        children = this._renderDate();
        break;
    }
    return <View style={styles.content}>{children}</View>;
  }
  _renderYear(): ReactElement {
    const { date } = this;
    const currentYear = date.getFullYear();
    let startYear = Math.max(currentYear - 5, this.minYear());
    let endYear = Math.min(currentYear + 5, this.maxYear());
    let children: ReactElement[] = [];
    for (; startYear <= endYear; startYear++) {
      children.push(
        (startYear => (
          <View style={styles.yearCell} key={startYear}>
            <TouchableOpacity
              style={styles.yearCellContent}
              onPress={() => this._selectYear(startYear)}
            >
              <Text style={styles.yearCellText}>{startYear}</Text>
            </TouchableOpacity>
          </View>
        ))(startYear)
      );
    }
    return <View style={styles.yearContent}>{children}</View>;
  }
  _renderMonth(): ReactElement {
    const { date } = this;
    const currentYear = date.getFullYear();
    const maxMonth = this.maxMonth(currentYear);
    let minMonth = this.minMonth(currentYear);
    let children: ReactElement[] = [];
    for (; minMonth <= maxMonth; minMonth++) {
      children.push(
        (minMonth => (
          <View style={styles.monthCell} key={minMonth}>
            <TouchableOpacity
              style={styles.monthCellContent}
              onPress={() => this._selectMonth(minMonth - 1)}
            >
              <Text style={styles.monthCellText}>{minMonth}月</Text>
            </TouchableOpacity>
          </View>
        ))(minMonth)
      );
    }
    return <View style={styles.monthContent}>{children}</View>;
  }
  _renderDate(): ReactElement {
    const { date } = this;
    const selectedDate = new Date(this.props.value);
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const maxDate = this.maxDate(currentYear, currentMonth);
    const minDate = this.minDate(currentYear, currentMonth);
    const selectYear = selectedDate.getFullYear();
    const selectMonth = selectedDate.getMonth() + 1;
    const selectDate =
      selectYear === currentYear && currentMonth === selectMonth
        ? selectedDate.getDate()
        : -1;

    let children: ReactElement[] = [];
    for (let i = minDate; i <= maxDate; i++) {
      children.push(
        (minDate => (
          <View
            style={[
              styles.dateCell,
              selectDate === minDate ? styles.dateCellSelected : null
            ]}
            key={minDate}
          >
            <TouchableOpacity
              style={styles.dateCellContent}
              onPress={() => this._selectDate(minDate)}
            >
              <Text
                style={[
                  styles.dateCellText,
                  selectDate === minDate ? styles.dateSelected : null
                ]}
              >
                {minDate}
              </Text>
            </TouchableOpacity>
          </View>
        ))(i)
      );
    }
    let firstDayOfMonth = date.firstDayOfMonth();
    let lastDayOfMonth = date.lastDayOfMonth();
    const weekOfBefore = firstDayOfMonth;
    if (minDate == 1) {
      const lastMonth = currentMonth - 1;
      const lastMonthDate = new XDate(currentYear, lastMonth - 1, 1);
      const dayOfMonth = lastMonthDate.daysOfMonth();
      let lastMonthMinDate = this.minDate(currentYear, lastMonth);
      if (weekOfBefore !== 0) {
        for (let i = 0; i < weekOfBefore; i++) {
          children.unshift(
            (i => (
              <View style={styles.dateCell} key={0 - i}>
                <TouchableOpacity
                  style={styles.dateCellContent}
                  onPress={() => this._selectMonth(lastMonth - 1)}
                >
                  <Text style={[styles.dateCellText, styles.dateDisabled]}>
                    {dayOfMonth - i < lastMonthMinDate ? '' : dayOfMonth - i}
                  </Text>
                </TouchableOpacity>
              </View>
            ))(i)
          );
        }
      }
    }
    const weekOfRest = 6 - lastDayOfMonth;
    if (maxDate == date.daysOfMonth()) {
      let nextMonth = currentMonth + 1;
      let nextMonthMaxDate = this.maxDate(currentYear, nextMonth - 1);
      for (let i = 1; i <= weekOfRest; i++) {
        children.push(
          (i => (
            <View style={styles.dateCell} key={31 + i}>
              <TouchableOpacity
                style={styles.dateCellContent}
                onPress={() => this._selectMonth(nextMonth - 1)}
              >
                <Text style={[styles.dateCellText, styles.dateDisabled]}>
                  {nextMonthMaxDate < i ? '' : i}
                </Text>
              </TouchableOpacity>
            </View>
          ))(i)
        );
      }
    }

    const e = ['日', '一', '二', '三', '四', '五', '六'];
    return (
      <View style={styles.dateContent}>
        <View style={styles.week}>
          {e.map(d => {
            return (
              <View key={d} style={styles.weekCell}>
                <Text style={styles.weekText}>{d}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.dateWrapper}>
          <View style={styles.dateContentWrapper}>{children}</View>
        </View>
      </View>
    );
  }
  _selectMonth(month: number) {
    this.setMonth(month);
    this.setState({
      stage: 'date'
    });
  }
  _selectYear(year: number) {
    this.setFullYear(year);
    this.setState({
      stage: 'month'
    });
  }
  _selectDate(date: number) {
    this.setDate(date);
    this.select();
  }
  _next = () => {
    const date = this.date;
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const maxYear = this.maxYear();
    switch (this.state.stage) {
      case 'year':
        this.setFullYear(Math.min(maxYear, currentYear + 10));
        break;
      case 'month':
        this.setFullYear(Math.min(maxYear, currentYear + 1));
        break;
      case 'date':
        let year, month;
        if (currentYear < maxYear) {
          if (currentMonth == 11) {
            year = currentYear + 1;
            month = 0;
            this.setFullYear(year);
            this.setMonth(month);
          } else {
            this.setMonth(currentMonth + 1);
          }
        } else {
          this.setMonth(Math.min(this.maxMonth(currentYear), currentMonth + 1));
        }
        break;
    }
  };
  _pre = () => {
    const date = this.date;
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const minYear = this.minYear();
    switch (this.state.stage) {
      case 'year':
        this.setFullYear(Math.max(minYear, currentYear - 10));
        break;
      case 'month':
        this.setFullYear(Math.max(minYear, currentYear - 1));
        break;
      case 'date':
        let year, month;
        if (currentYear > minYear) {
          if (currentMonth == 0) {
            year = currentYear - 1;
            month = 11;
            this.setFullYear(year);
            this.setMonth(month);
          } else {
            this.setMonth(currentMonth - 1);
          }
        } else {
          this.setMonth(Math.max(this.minMonth(currentYear), currentMonth - 1));
        }
        break;
    }
  };
}

const styles = createStyle(theme => {
  const color = '#e10000';
  const contentHeight = 30 * 6 + 36 + 16;
  const contentWidth = vw(100) - 32;
  return {
    wrapper: {
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      justifyContent: 'center'
    },
    header: {
      height: 36,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerButton: {
      marginHorizontal: 32,
      width: 50,
      justifyContent: 'center',
      alignItems: 'center'
    },
    yearHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    yearHeaderText: {
      color,
      fontSize: theme.f3,
      paddingHorizontal: 8
    },
    divide: {
      width: 8,
      backgroundColor: color,
      height: theme.px
    },
    dateHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    dateHeaderYear: {
      paddingHorizontal: 8
    },
    dateHeaderMonth: {
      paddingHorizontal: 16
    },
    monthHeader: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    monthHeaderCell: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center'
    },
    monthHeaderText: {
      color,
      fontSize: theme.f3
    },
    content: {
      borderTopWidth: theme.px,
      borderColor: theme.borderColor,
      width: contentWidth,
      height: contentHeight,
      justifyContent: 'center',
      alignItems: 'center'
    },
    yearCell: {
      height: 64,
      width: contentWidth / 4
    },
    yearCellContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    monthCell: {
      height: 64,
      width: contentWidth / 4
    },
    monthCellContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    dateCell: {
      width: contentWidth / 7,
      height: 30,
      borderRadius: 4,
      overflow: 'hidden'
    },
    dateCellContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    yearCellText: {
      color: theme.color,
      fontSize: theme.f3
    },
    monthCellText: {
      color: theme.color,
      fontSize: theme.f3
    },
    dateCellText: {
      color: theme.color,
      fontSize: theme.f3
    },
    yearContent: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    monthContent: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    dateContent: {
      flex: 1
    },
    today: {
      backgroundColor: '#e10000'
    },
    week: {
      flexDirection: 'row',
      borderBottomWidth: theme.px,
      borderColor: theme.borderColor
    },
    dateWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    dateContentWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    weekCell: {
      width: contentWidth / 7,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center'
    },
    weekText: {
      color: theme.color,
      fontSize: theme.f3
    },
    dateSelected: {
      color: '#fff'
    },
    dateCellSelected: {
      backgroundColor: '#e10000'
    },
    dateDisabled: {
      color: '#ccc'
    }
  };
});
export default DateTable;
