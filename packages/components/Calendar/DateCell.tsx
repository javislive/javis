import React, { PureComponent } from 'react';
import {
  findNodeHandle,
  UIManager
} from 'react-native';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui';
import { isEmpty } from 'lodash';
import XDate from 'components/VisualDatePicker/XDate';
import { createStyle } from 'themes';
import {
  vw,
  // resize
} from 'utils/resize';
import Context from './Context';
const { Consumer } = Context;

interface DateCellProps {
  parent: any;
  date?: XDate;
}

function isFinished(arr: any) {
  let is_finish = 1;
  if (arr && arr.length > 0) {
    const result = arr.filter(item => item.is_finish === 0);
    if (result && result.length > 0) {
      is_finish = 0;
    }
  }
  return is_finish;
}

export default class DateCell extends PureComponent<DateCellProps> {
  static cells: {
    [idx: string]: DateCell;
  } = {};
  static activeCells: DateCell[] = [];
  static selectedCells: DateCell[] = [];
  static update(selectDate?: any[], data?: any[]) {
    let cell;
    DateCell.activeCells.forEach(cell => {
      cell && cell.update('empty');
    });
    DateCell.activeCells = [];
    const activeCells = DateCell.activeCells;

    if (selectDate) {
      selectDate.forEach((item: any) => {
        const arr = item.split("-");
        const ts = new XDate(arr[0], arr[1] - 1, arr[2]).toDateString();
        cell = DateCell.cells[ts];
        const is_finish = data && !isEmpty(data) ? isFinished(data[item]) : 1;
        const backgroundColor = (is_finish === 1 ? "#82704A" : "#D45747");
        cell && cell.update('selected', backgroundColor);
        activeCells.push(cell);
      });
    }
  }
  state = {
    status: '',
    backgroundColor: ''
  };
  constructor(props: DateCellProps) {
    super(props);
    if (props.date) {
      DateCell.cells[props.date.toDateString()] = this;
    }
  }

  componentWillUnmount() {
    if (this.props.date) {
      delete DateCell.cells[this.props.date.toDateString()];
    }
  }

  update(status: string, backgroundColor?: string) {
    this.setState({
      status,
      backgroundColor
    });
  }

  private _onDateClick = (date: any, callback: any) => {
    if (this._item) {
      UIManager.measure(findNodeHandle(this._item), (x, y, width, height, pageX, pageY) => {
        const { parent } = this.props;
        date &&
          callback(date, parent, { x, y, width, height, pageX, pageY });
      })
    }
  }

  render() {
    const { date } = this.props;
    const { status, backgroundColor = '#82704A' } = this.state;
    if (date === undefined) {
      return null;
    }
    const isSelected = status === 'selected';
  
    return (
      <Consumer>
        {({
          onDateClick,
        }: any) => {
          return (
            <View style={[styles.dateCell]}>
              <View style={[styles.dateCellI]}>
                <TouchableOpacity
                  ref={(item) => {
                    this._item = item;
                  }}
                  style={[
                    styles.dateCellContent,
                    date === null ? { backgroundColor: 'transparent' } : null,
                    isSelected ? { backgroundColor } : null,
                  ]}
                  onPress={() => this._onDateClick(date, onDateClick)}
                >
                  <Text
                    style={[
                      styles.dateCellText,
                      isSelected ? styles.dateSelected : null,
                      // !(date && date.isValidDate) ? styles.dateDisabled : null
                    ]}
                  >
                    {date ? date.getDate() : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </Consumer>
    );
  }
}

const styles = createStyle(theme => {
  const paddingHorizontal = 0;
  const contentWidth = vw(100) - paddingHorizontal * 2;
  const CELL_RECT = 27;
  return {
    dateCell: {
      width: contentWidth / 7,
      height: CELL_RECT,
      overflow: 'hidden',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateCellI: {
      width: contentWidth / 7,
      height: CELL_RECT,
      borderLeftWidth: (contentWidth / 7 - CELL_RECT) / 2,
      borderLeftColor: 'transparent',
      borderRightWidth: (contentWidth / 7 - CELL_RECT) / 2,
      borderRightColor: 'transparent',
      flexDirection: 'row'
    },
    dateCellContent: {
      width: CELL_RECT,
      borderRadius: CELL_RECT / 2,
      backgroundColor: '#F4F5F7',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dateCellText: {
      color: '#282828',
      fontSize: 13
    },
    dateSelected: {
      color: '#fff'
    },
    dateDisabled: {
      // color: '#ccc',
      color: '#282828',
    },
  };
});
