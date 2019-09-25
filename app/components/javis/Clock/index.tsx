import React, {PureComponent} from 'react';
import {Text, View} from 'react-native-ui';

import XDate from 'components/VisualDatePicker/XDate';

export default class Clock extends PureComponent {
  state = {
    time: new XDate(),
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
      this.setState({time});
    }, 500);
  }
  render() {
    const {time} = this.state;
    const year = time.getFullYear();
    return (
      <View>
        <View>
          <View>
            <Text>{time.getFullHours()}</Text>
          </View>
          <View>
            <Text>{time.getFullMinutes()}</Text>
          </View>
          <View>
            <Text>{time.getFullSeconds()}</Text>
          </View>
        </View>
        <View>
          <Text>{time.format('yyyy年MM月dd日')}</Text>
        </View>
        <View>
          <Text>
            {year}
            还剩下
            {}天{}小时
            {}分{}秒
          </Text>
        </View>
      </View>
    );
  }
}
