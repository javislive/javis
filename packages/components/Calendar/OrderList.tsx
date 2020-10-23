import React, { PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native-ui';
import moment from 'moment'
import { isEmpty } from 'lodash';
import { dispatch } from "febrest";
import { createStyle } from 'themes';
import { resize } from 'utils/resize';
import XDate from 'components/VisualDatePicker/XDate';
import Context from './Context';
const { Consumer } = Context;

const TRIANGLE_WIDTH = 10;

export default class OrderList extends PureComponent {

  private _getTriangleStyle = (position: any) => {
    const style = styles.triangle;
    if (position) {
      const left = position.pageX + position.width / 2 - TRIANGLE_WIDTH / 2;
      return Object.assign({}, style, { left });
    }
    return style;
  }

  _goToDetail = (order_id, order_type) => {
    dispatch("app.navigate", { routeName: "Contract", params: { id: order_id, type: order_type } });
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
                  <View style={[styles.col]}><Text style={styles.headText}>订单编号</Text></View>
                  <View style={styles.col}><Text style={styles.headText}>客户姓名</Text></View>
                  <View style={[styles.col]}><Text style={styles.headText}>手机号</Text></View>
                  <View style={[styles.col]}><Text style={styles.headText}>下单日期</Text></View>
                </View>
                {
                  dateDetail.map((item, index) => {
                    if (!item) return null;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.item}
                        onPress={() => {
                          this._goToDetail(item.id, item.order_type)
                        }}
                      >
                        <View style={[styles.col]}><Text style={styles.itemText}>{item.order_id}</Text></View>
                        <View style={styles.col}><Text style={styles.itemText}>{item.person}</Text></View>
                        <View style={[styles.col]}><Text style={styles.itemText}>{item.tel}</Text></View>
                        <View style={[styles.col]}><Text style={styles.itemText}>{moment(item.update_time).format('YYYY-MM-DD')}</Text></View>
                      </TouchableOpacity>
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