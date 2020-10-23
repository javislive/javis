import React, { PureComponent, Fragment } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native-ui";

import moment from 'moment';
import { includes } from 'lodash';
import Application from "celtics/Application";
import { ORDER_TYPE } from "utils/topbridal";
import { resize } from "utils/resize";
import { dispatch } from "febrest";

interface Props {
  data: any;
}

const FORMAT_REGEXP = 'YYYY-MM-DD';

export default class OrderListItem extends PureComponent<Props> {

  _getTypeImg = (type: any, has_edit: any) => {
    let typeImg = has_edit == 0 ? require(`./types/hold2.png`) : require(`./types/hold.png`);
    switch (type) {
      case ORDER_TYPE.RENT:
        typeImg = has_edit == 0 ? require(`./types/rent2.png`) : require(`./types/rent.png`);
        break;
      case ORDER_TYPE.SELL:
        typeImg = has_edit == 0 ? require(`./types/sell2.png`) : require(`./types/sell.png`);
        break;
      case ORDER_TYPE.COUTURE:
        typeImg = has_edit == 0 ? require(`./types/couture2.png`) : require(`./types/couture.png`);
        break;
      case ORDER_TYPE.TRY:
        typeImg = has_edit == 0 ? require(`./types/try2.png`) : require(`./types/try.png`);
        break;

      default:
        break;
    }
    return typeImg;
  }

  _getTypeText = (type: any) => {
    let typeText = '预';
    switch (type) {
      case ORDER_TYPE.RENT:
        typeText = '租';
        break;
      case ORDER_TYPE.SELL:
        typeText = '售';
        break;
      case ORDER_TYPE.COUTURE:
        typeText = '定';
        break;
      case ORDER_TYPE.TRY:
        typeText = '试';
        break;

      default:
        break;
    }
    return typeText;
  }

  render() {
    const { data = {} } = this.props;
    return (
      <TouchableOpacity
        style={styles.wrapper}
        onPress={() => { this._gotoDetail(data) }}
      >
        <View style={styles.main}>
          <View style={styles.mainTop}>
            <Image
              style={{ width: resize(20), height: resize(20), marginRight: resize(3) }}
              source={this._getTypeImg(data.order_type, data.has_edit)}
            />
            {/* <View style={styles.typeWrap}>
              <Text style={styles.typeText}>{this._getTypeText(data.order_type)}</Text>
            </View> */}
            <Text style={styles.topText}>{data.order_id}</Text>
            <Text style={[styles.topText, { marginRight: 0, width: resize(90) }]}>{data.person}</Text>
            <Text style={styles.topText}>{data.tel}</Text>
          </View>
          <View style={styles.mainBottom}>
            {
              includes([ORDER_TYPE.HOLD_RENT, ORDER_TYPE.HOLD_SELL], data.order_type) ? (
                <Text style={styles.bottomText}>预留日期:{data.hold_start_date && data.hold_end_date ? `${moment(data.hold_start_date).format(FORMAT_REGEXP)} ~ ${moment(data.hold_end_date).format(FORMAT_REGEXP)}` : ''}</Text>
              ) : (
                  <Fragment>
                    <Text style={styles.bottomText}>大婚日期:{data.wedding_date ? moment(data.wedding_date).format(FORMAT_REGEXP) : ''}</Text>
                    <Text style={styles.bottomText}>下单日期:{data.order_time ? moment(data.order_time).format(FORMAT_REGEXP) : ''}</Text>
                  </Fragment>
                )
            }

            {
              data.has_edit == 1
                ? <Text style={styles.bottomText}>更新日期:{data.updated_at ? moment(data.updated_at).format(FORMAT_REGEXP) : ''}</Text>
                : null
            }
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.buttonTouch}
            onPress={() => { this._gotoEdit(data.id) }}
          >
            <Text style={styles.buttonText}>编辑</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  private _gotoEdit = (id: any) => {
    dispatch("app.navigate", { routeName: "OrderEdit", params: { orderId: id } });
  };

  private _gotoDetail = (data: any) => {
    dispatch("app.navigate", { routeName: "Contract", params: { id: data.id, type: data.order_type } });
  };
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      borderBottomWidth: theme.px,
      borderColor: theme.borderColor,
      backgroundColor: "#fff",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    main: {
      flex: 1,
      marginTop: resize(19),
      marginBottom: resize(13)
    },
    mainTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: resize(3)
    },
    typeWrap: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#82704A',
      width: resize(20),
      height: resize(20),
      marginRight: resize(3),
      borderRadius: resize(10)
    },
    typeText: {
      color: '#FFF',
      fontSize: resize(11),
    },
    topText: {
      color: "#3A3A3A",
      fontSize: resize(13),
      marginRight: resize(25)
    },
    mainBottom: {
      flexDirection: "row"
    },
    bottomText: {
      color: "#3A3A3A88",
      fontSize: resize(13),
      marginRight: resize(10)
    },
    button: {
      width: resize(50),
      height: resize(25),
      borderRadius: resize(16),
      borderColor: "#806E47",
      borderWidth: theme.px,
      overflow: "hidden"
    },
    buttonTouch: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    buttonText: {
      color: "#806E47",
      fontSize: resize(13)
    }
  };
});
