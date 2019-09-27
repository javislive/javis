import React, {PureComponent} from 'react';
import {Text, View} from 'react-native-ui';
import {resize, vw} from 'utils/resize';

import Application from 'celtics/Application';
import XDate from 'components/VisualDatePicker/XDate';

export default class Clock extends PureComponent {
  state = {
    time: new XDate(),
    tink: 1,
  };
  private _timeoutHandler: NodeJS.Timeout | undefined;
  componentDidMount() {
    this._run();
  }
  componentWillUnmount() {
    this._timeoutHandler && clearTimeout(this._timeoutHandler);
  }
  _run() {
    this._timeoutHandler = setTimeout(() => {
      const time = new XDate();
      const tink = (this.state.tink % 2) + 1;
      this.setState({time, tink});
      this._run();
    }, 500);
  }
  render() {
    const {time, tink} = this.state;
    const year = time.getFullYear();
    const nextYear = new Date(year + 1, 0, 1, 0, 0, 0).getTime();
    let r = nextYear - time.getTime();
    const day = Math.floor(r / 86400000);
    r = r - day * 86400000;
    const h = Math.floor(r / 3600000);
    r = r - h * 3600000;
    const m = Math.floor(r / 60000);
    r = r - m * 60000;
    const s = Math.floor(r / 1000);
    return (
      <View style={styles.wrapper}>
        <View style={styles.clockWrapper}>
          <View style={styles.timeWrapper}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{time.getFullHours()}</Text>
            </View>
            <View style={[styles.timeColumn, styles.tink]}>
              <Text style={styles.timeText}>{tink === 2 ? ':' : ''}</Text>
            </View>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{time.getFullMinutes()}</Text>
            </View>
          </View>
          <View style={styles.date}>
            <Text style={styles.dateText}>{time.format('yyyy年MM月dd日')}</Text>
          </View>
        </View>
        <View style={styles.restDate}>
          <Text style={styles.resetDateText}>
            距离
            {year + 1}
            年还有
            {day}天{h}小时
            {m}分{s}秒
          </Text>
        </View>
      </View>
    );
  }
}
const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      flex: 1,
      alignItems: 'center',
    },
    clockWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      height: vw(60),
      // borderWidth: 2,
      // borderColor: '#d9d9da',
    },
    timeWrapper: {
      flexDirection: 'row',
    },
    timeColumn: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    timeText: {
      color: 'rgb(45, 45, 45)',
      fontSize: resize(60),
    },
    tink: {
      width: resize(30),
    },
    date: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: resize(22),
    },
    dateText: {
      color: 'rgb(45, 45, 45)',
      fontSize: resize(12),
      fontWeight: '100',
    },
    restDate: {},
    resetDateText: {
      color: 'rgb(45, 45, 45)',
      fontSize: resize(12),
      fontWeight: '100',
    },
  };
});
