import React, { PureComponent } from 'react';

import DatePickerWithHeader from 'components/DatePickerWithHeader';
import { View } from 'react-native-ui';
import { createStyle } from 'themes';
import { resize } from 'utils/resize';

interface Props {}
export interface Payload {
  onFinish: (date: {
    start?: number;
    end?: number;
    selectDate?: number[];
  }) => void;
  startTime?: number;
  endTime?: number;
  pickTimes?: number;
  onDateSelect?: (date: number) => void;
  selectDate?: { date: number; backgroundColor?: string }[];
}
export default class DatePicker extends PureComponent<Props> {
  state: { [id: string]: any } & Payload = {
    startTime: 0,
    endTime: 0,
    onFinish: (info: {
      start?: number;
      end?: number;
      selectDate?: number[];
    }) => {},
    isShow: false
  };
  isShow() {
    return this.state.isShow;
  }
  show({ startTime, endTime, onFinish, selectDate, onDateSelect }: Payload) {
    this.setState({
      startTime,
      endTime,
      onFinish,
      selectDate,
      onDateSelect,
      isShow: true
    });
  }
  close() {
    this.setState({ isShow: false });
  }
  render() {
    const {
      startTime,
      endTime,
      isShow,
      onFinish,
      onDateSelect,
      selectDate,
      pickTimes
    } = this.state;
    if (!isShow) {
      return null;
    }
    return (
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <DatePickerWithHeader
            start={startTime}
            end={endTime}
            onDateSelect={onDateSelect}
            selectDate={selectDate}
            pickTimes={pickTimes}
            onCancel={() => this.close()}
            onFinish={info => {
              onFinish && onFinish(info);
              this.close();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = createStyle(theme => {
  return {
    wrapper: {
      bottom: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      paddingTop: resize(58),
      backgroundColor: '#00000088'
    },
    content: {
      flex: 1,
      backgroundColor: '#fff'
    }
  };
});
