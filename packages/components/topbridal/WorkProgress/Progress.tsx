import React, {
  PureComponent,
  Fragment,
  RefObject,
  createRef,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native-ui";

import { replace } from 'lodash';
import Application from "celtics/Application";
import { resize } from "utils/resize";
import { dispatch } from "febrest";
import common from "actions/common";
import createStyles from './createStyles';
import TextInput from "components/TextInput";
import moment from 'moment';

interface Props {
  data?: any;
  onHide?: () => void;
  onFinish?: () => void;
}

export default class Item extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isAddRecord: false,
      content: null,
      arr: props.data && props.data.progress || []
    }
  }

  _svRef: RefObject<ScrollView> = createRef();

  render() {
    const { data = {} } = this.props;
    const { isAddRecord, arr } = this.state;
    return (
      <Fragment>
        <ScrollView
          ref={this._svRef}
          style={[styles.content, { paddingVertical: resize(10) }]}
        >
          {
            arr.map((item: any, index: any) => {
              const borderStyle = this._getBorderStyle(arr, index);
              const pointStyle = styles.itemPoint;
              const date = replace(item.updated_at, /-/g, '/');
              return (
                <View key={index} style={borderStyle}>
                  <Text style={styles.itemDateText}>{moment(date).format('YY/MM/DD hh:mm')}</Text>
                  <Text style={styles.itemContentText}>{item.content}</Text>
                  <View style={pointStyle} />
                </View>
              )
            })
          }
          {
            this._renderExtraItem()
          }
        </ScrollView>
        <View style={styles.footer}>
          {
            data.is_finish == 1 ?
              this._renderOk()
              :
              (!isAddRecord ? this._renderOperationFooter(data) : this._renderAddOperationFooter(data))
          }
        </View>
      </Fragment>
    );
  }

  private _doFinish = (data: any) => {
    const { onHide, onFinish } = this.props;
    dispatch(common.finishWork, { id: data.id })
      .then((res: any) => {
        onHide && onHide();
        onFinish && onFinish();
      });
  }

  private _addWorkRecord = (data: any) => {
    const { content } = this.state;

    dispatch(common.addWorkRecord, { id: data.id, content })
      .then((res: any) => {
        const { arr } = this.state;
        arr.push({
          content,
          updated_at: moment(Date.now()).format('YY/MM/DD hh:mm'),
          created_at: moment(Date.now()).format('YY/MM/DD hh:mm'),
        })
        this.setState({
          isAddRecord: false,
          content: null,
        })
      });
  }

  private _getBorderStyle = (arr: any, index: any) => {
    let style = styles.item;
    if (index === arr.length - 1) {
      style = Object.assign({}, style, styles.itemBorderGrey)
    }
    return style;
  }

  private _renderExtraItem = () => {
    const { isAddRecord, content } = this.state;
    const borderStyle = Object.assign({}, styles.item, { borderColor: 'transparent' });
    const pointStyle = Object.assign({}, styles.itemPoint, styles.itemPointGrey);
    return (
      <View style={borderStyle}>
        <Text style={[styles.itemDateText, isAddRecord ? {} : { color: '#3B3E42' }]}>{isAddRecord ? moment(Date.now()).format('YY/MM/DD hh:mm') : "待添加"}</Text>
        {
          isAddRecord && (
            <TextInput
              onChangeText={text => {
                this.setState({
                  content: text
                })
              }}
              multiline={true}
              radius={false}
              value={content || ''}
              textAlignVertical="top"
              underlineColorAndroid="transparent"
              placeholder="请输入最新进展"
              style={styles.textarea}
              inputStyle={styles.textStyle}
            ></TextInput>
          )
        }
        <View style={pointStyle} />
      </View>
    )
  }

  private _renderOk = () => {
    const { onHide } = this.props;
    return (
      <TouchableOpacity
        style={[styles.button, styles.okButton]}
        onPress={() => { onHide && onHide() }}
      >
        <Text style={[styles.buttonText, styles.okButtonText]}>好的</Text>
      </TouchableOpacity>
    )
  }

  private _renderOperationFooter = (data: any) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => this._doFinish(data)}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>完成工作</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.okButton]}
          onPress={() => {
            this.setState({
              isAddRecord: true,
            }, () => {
              this._svRef.current.scrollToEnd({ animated: true })
            });
          }}
        >
          <Text style={[styles.buttonText, styles.okButtonText]}>添加进展</Text>
        </TouchableOpacity>
      </View>
    )
  }

  private _renderAddOperationFooter = (data: any) => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            this.setState({
              content: null,
              isAddRecord: false
            });
          }}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>取消操作</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.okButton]}
          onPress={() => this._addWorkRecord(data)}
        >
          <Text style={[styles.buttonText, styles.okButtonText]}>确认添加</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = Application.createStyle(theme => {
  return {
    ...createStyles(theme),
    item: {
      position: 'relative',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingLeft: resize(24),
      minHeight: resize(30),
      borderColor: '#3B3E42',
      borderLeftWidth: resize(4),
      marginLeft: resize(6)
    },
    itemBorderGrey: {
      borderColor: '#97989B',
    },
    itemPoint: {
      position: 'absolute',
      backgroundColor: '#3B3E42',
      height: resize(14),
      width: resize(14),
      borderRadius: resize(7),
      top: 0,
      left: resize(-8.5),
    },
    itemPointGrey: {
      backgroundColor: '#97989B',
    },
    itemDateText: {
      fontSize: resize(12),
      color: '#BDBDBD',
    },
    itemContentText: {
      fontSize: resize(12),
      color: '#3B3E42',
      paddingLeft: resize(10),
      flex: 1,
    },
    textarea: {
      backgroundColor: '#FFF',
      borderRadius: resize(5),
      height: resize(43),
      width: resize(203),
      padding: 0,
      textAlign: 'right',
    },
    textStyle: {
      fontSize: resize(13),
      lineHeight: resize(15),
    }
  };
});
