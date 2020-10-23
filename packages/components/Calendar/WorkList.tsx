import React, { PureComponent } from 'react';
import {
  Text,
  View,
} from 'react-native-ui';
import { isEmpty } from 'lodash';
import { createStyle } from 'themes';
import { resize } from 'utils/resize';
import XDate from 'components/VisualDatePicker/XDate';
import Context from './Context';
const { Consumer } = Context;

const TRIANGLE_WIDTH = 10;

export default class WorkList extends PureComponent {

  private _getTriangleStyle = (position: any) => {
    const style = styles.triangle;
    if (position) {
      const left = position.pageX + position.width / 2 - TRIANGLE_WIDTH / 2;
      return Object.assign({}, style, { left });
    }
    return style;
  }

  _formatDate(date: any) {
    const arr = date.split("-");
    const ts = new XDate(arr[0], arr[1] - 1, arr[2]);
    return XDate.format("MM/dd", ts);
  }

  _getProgress = (progress: any) => {
    if (!progress || isEmpty(progress)) {
      return '';
    } else {
      return progress[0] ? progress[0]['content'] : '';
    }
  }

  render() {
    return (
      <Consumer>
        {({
          dateDetail,
          itemPostion,
        }: any) => {
          if (!dateDetail || isEmpty(dateDetail)) return null;
          return (
            <View style={styles.detail}>
              <View style={styles.detailContent}>
                <View style={styles.header}>
                  <View style={[styles.col]}><Text style={styles.headText}>序号</Text></View>
                  <View style={[styles.col, styles.col_2]}><Text style={styles.headText}>项目名称</Text></View>
                  <View style={styles.col}><Text style={styles.headText}>开始时间</Text></View>
                  <View style={[styles.col, styles.col_2]}><Text style={styles.headText}>预计结束时间</Text></View>
                  <View style={[styles.col, styles.col_2]}><Text style={styles.headText}>工作内容</Text></View>
                  <View style={[styles.col, styles.col_2]}><Text style={styles.headText}>最新进展</Text></View>
                </View>
                {
                  dateDetail.map((item, index) => {
                    return (
                      <View key={index} style={styles.item}>
                        <View style={[styles.col]}><Text style={styles.itemText}>{index + 1}</Text></View>
                        <View style={[styles.col, styles.col_2]}><Text style={styles.itemText}>{item.title}</Text></View>
                        <View style={styles.col}><Text style={styles.itemText}>{this._formatDate(item.start)}</Text></View>
                        <View style={[styles.col, styles.col_2]}><Text style={styles.itemText}>{this._formatDate(item.end)}</Text></View>
                        <View style={[styles.col, styles.col_2]}><Text style={styles.itemText}>{item.content}</Text></View>
                        <View style={[styles.col, styles.col_2]}><Text style={styles.itemText}>{this._getProgress(item.progress)}</Text></View>
                      </View>
                    )
                  })
                }
              </View>
              <View style={this._getTriangleStyle(itemPostion)} />
            </View>
          );
        }}
      </Consumer>
    );
  }
}

const styles = createStyle(theme => {
  return {
    detail: {
      position: 'relative',
      width: theme.clientWidth,
      paddingTop: TRIANGLE_WIDTH + 5,
      minHeight: resize(162),
      overflow: 'hidden',
    },
    detailContent: {
      backgroundColor: '#FFF',
      flex: 1
    },
    triangle: {
      position: 'absolute',
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: TRIANGLE_WIDTH / 2,
      borderRightWidth: TRIANGLE_WIDTH / 2,
      borderBottomWidth: TRIANGLE_WIDTH,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: '#FFF',
      left: 0,
      top: 5,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: resize(25),
    },
    col: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      flex: 0.8,
    },
    col_2: {
      justifyContent: 'center',
      flex: 1.5
    },
    item: {
      display: 'flex',
      flexDirection: 'row',
      // alignItems: 'center',
      alignItems: 'flex-start',
      minHeight: resize(25),
      marginTop: resize(5),
    },
    headText: {
      fontSize: resize(12),
      color: 'rgba(189, 189, 189, 1)',
    },
    itemText: {
      fontSize: resize(12),
      color: 'rgba(58, 58, 58, 1)',
    },
    underlineItemText: {
      textDecorationLine: 'underline'
    }
  };
});