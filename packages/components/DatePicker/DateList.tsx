import {
  FlatList,
  SectionList,
  Text,
  TouchableOpacity,
  View
} from 'react-native-ui';
import React, { PureComponent, ReactElement } from 'react';
import {
  VisualDatePicker,
  VisualDatePickerProps
} from 'components/VisualDatePicker';

import FontIcon from 'components/FontIcon';
import XDate from 'components/VisualDatePicker/XDate';
import { createStyle } from 'themes';
import { vw } from 'utils/resize';

export interface Props extends VisualDatePickerProps {
  onFinish: (info: {
    start?: number;
    end?: number;
    selectDate?: number[];
  }) => void;
  startDate?: number | undefined;
  endDate?: number | undefined;
  pickTimes?: number;
  onDateSelect?: (date: number) => void;
  selectDate?: { date: number; backgroundColor?: string }[];
}
let now = new XDate();
now = new XDate(now.getFullYear(), now.getMonth(), now.getDate());
interface DateCellProps {
  date?: XDate;
  onPress: (date: XDate) => void;
}
class DateCell extends PureComponent<DateCellProps> {
  static cells: {
    [idx: string]: DateCell;
  } = {};
  static activeCells: DateCell[] = [];
  static selectedCells: DateCell[] = [];
  static update(selectDate?: any[]) {
    let start, end, cell;
    DateCell.activeCells.forEach(cell => {
      cell && cell.update('empty');
    });
    DateCell.activeCells = [];
    const activeCells = DateCell.activeCells;

    if (END_DATE && START_DATE) {
      end = END_DATE.copy();
      start = START_DATE.copy();
      cell = DateCell.cells[start.toDateString()];
      cell && cell.update('is_start_date');
      activeCells.push(cell);
      cell = DateCell.cells[end.toDateString()];
      cell && cell.update('is_end_date');
      activeCells.push(cell);
      start.nextDate();
      while (start.getTime() < end.getTime()) {
        cell = DateCell.cells[start.toDateString()];
        cell && cell.update('is_between');
        activeCells.push(cell);
        start.nextDate();
      }
    } else if (START_DATE) {
      start = START_DATE.copy();
      cell = DateCell.cells[start.toDateString()];
      cell && cell.update('selected');
      activeCells.push(cell);
    } else if (selectDate) {
      selectDate.forEach((item: any) => {
        cell = DateCell.cells[new XDate(item.date).toDateString()];
        cell && cell.update('selected', item.backgroundColor);
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
  render() {
    const { date, onPress } = this.props;
    const { status, backgroundColor = '#82704A' } = this.state;
    if (date === undefined) {
      return null;
    }
    const isSelected = status === 'selected';
    const isStartDate = status === 'is_start_date';
    const isEndDate = status === 'is_end_date';
    const isBetween = status === 'is_between';
    return (
      <View style={[styles.dateCell, isBetween ? styles.dateBetween : null]}>
        <View
          style={[
            styles.dateCellI,
            isStartDate ? styles.dateCellIIsStart : null,
            isEndDate ? styles.dateCellIIsEnd : null
          ]}
        >
          <TouchableOpacity
            style={[
              styles.dateCellContent,
              date === null ? { backgroundColor: '#fff' } : null,
              isSelected
                ? {
                    backgroundColor
                  }
                : null,
              isStartDate ? styles.dateCellContentStart : null,
              isBetween ? styles.dateCellContentBetween : null,
              isEndDate ? styles.dateCellEnd : null
            ]}
            onPress={() => date && date.isValidDate && onPress(date)}
          >
            <Text
              style={[
                styles.dateCellText,
                isStartDate || isEndDate || isSelected || isBetween
                  ? styles.dateSelected
                  : null,
                !(date && date.isValidDate) ? styles.dateDisabled : null
              ]}
            >
              {date ? date.getDate() : ''}
            </Text>
            {/* <Text style={[styles.dateCellTextTip, styles.dateSelected]}>
            {isStartDate || isSelected
              ? '开始时间'
              : isEndDate
              ? '结束时间'
              : ''}
          </Text> */}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

let START_DATE: XDate | null = null;
let END_DATE: XDate | null = null;

function DateRow(props: {
  items: XDate[];
  onItemPress: (date: XDate) => void;
}) {
  const { items, onItemPress } = props;
  return (
    <View style={styles.dateRow}>
      <DateCell date={items[0]} onPress={onItemPress} />
      <DateCell date={items[1]} onPress={onItemPress} />
      <DateCell date={items[2]} onPress={onItemPress} />
      <DateCell date={items[3]} onPress={onItemPress} />
      <DateCell date={items[4]} onPress={onItemPress} />
      <DateCell date={items[5]} onPress={onItemPress} />
      <DateCell date={items[6]} onPress={onItemPress} />
    </View>
  );
}
function SectionHeader({ title }: { title: 'string' }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
      <Week />
    </View>
  );
}
function Week() {
  const e = ['日', '一', '二', '三', '四', '五', '六'];
  return (
    <View style={styles.week}>
      {e.map(d => {
        return (
          <View key={d} style={styles.weekCell}>
            <Text style={[styles.weekText]}>{d}</Text>
          </View>
        );
      })}
    </View>
  );
}
const dateCellHeight = 60;

class DateList extends VisualDatePicker<Props> {
  static defaultProps = {
    start: now.getTime(),
    end: now.nextYear() || now.getTime() + 86399999
  };
  state: {
    startDate: null | XDate;
    endDate: null | XDate;
    sections: null | any[];
    selectedTimes: number;
    selectedDate: number[];
  } = {
    startDate: null,
    endDate: null,
    sections: null,
    selectedTimes: 0,
    selectedDate: []
  };
  constructor(props: Props) {
    super(props);
    this.state.startDate = props.startDate ? new XDate(props.startDate) : null;
    this.state.endDate = props.endDate ? new XDate(props.endDate) : null;
    START_DATE = this.state.startDate;
    END_DATE = this.state.endDate;
  }
  static getDerivedStateFromProps() {
    return {
      sections: null
    };
  }
  componentWillUnmount() {
    DateCell.cells = {};
    DateCell.activeCells = [];
  }
  componentDidMount() {
    DateCell.update(this.props.selectDate);
  }
  clear() {
    const { startDate, endDate, selectDate, onDateSelect } = this.props;
    if (typeof startDate !== 'undefined' || typeof endDate !== 'undefined') {
      this._finish({
        //@ts-ignore
        start: null,
        //@ts-ignore
        end: null
      });
      END_DATE = null;
      START_DATE = null;
      DateCell.update();
    } else {
      //默认选择一次
      const { pickTimes = 1 } = this.props;

      this._finish({ selectDate: new Array(pickTimes).fill(null) });
    }
  }
  render() {
    let { sections } = this.state;
    if (!sections) {
      sections = this._makeSections();
      this.state.sections = sections;
    }
    return (
      <View style={styles.wrapper}>
        <SectionList
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          style={styles.dateContentWrapper}
          sections={sections}
          getItemCount={() => sections.length}
          // getItemLayout={(data, index) => ({
          //   offset: dateCellHeight * index,
          //   index,
          //   length: dateCellHeight
          // })}
          stickySectionHeadersEnabled={true}
          keyExtractor={(item, index) => {
            return index + '';
          }}
          SectionSeparatorComponent={function() {
            return <View style={{ height: 10 }} />;
          }}
          renderSectionHeader={section => {
            return <SectionHeader title={section.section.title} />;
          }}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
  _renderItem = ({ item }) => {
    return <DateRow items={item} onItemPress={this._selectDate} />;
  };
  _makeSections() {
    const { start = 0, end = 0 } = this.props;
    const data = [];
    const startDate = new XDate(start);
    while (startDate.getTime() < end) {
      const month = startDate.getMonth();
      const year = startDate.getFullYear();
      const daysOfMonth = startDate.daysOfMonth();
      let days: [XDate | null][] = [];
      const firstDayOfMonth = startDate.firstDayOfMonth();
      let i = 0;
      for (; i < firstDayOfMonth; i++) {
        const row = days[0] || [];
        row.push(null);
        days[0] = row;
      }
      for (; i < daysOfMonth + firstDayOfMonth; i++) {
        const rowNum = Math.floor(i / 7);
        const columnNum = i % 7;
        const row = days[rowNum] || [];
        const date = new XDate(year, month, i + 1 - firstDayOfMonth);
        date.isValidDate = this.isValidDate(date);
        row[columnNum] = date;
        days[rowNum] = row;
      }
      data.push({
        title: year + '年' + (month + 1) + '月',
        data: days
      });
      startDate.nextMonth();
    }
    return data;
  }
  _selectDate = (date: XDate) => {
    // const { startDate, endDate } = this.state;
    const { startDate, endDate, selectDate, onDateSelect } = this.props;
    onDateSelect && onDateSelect(date.getTime());
    if (typeof startDate !== 'undefined' || typeof endDate !== 'undefined') {
      if (
        (START_DATE && END_DATE) ||
        (!START_DATE && !END_DATE) ||
        date.getTime() < START_DATE.getTime()
      ) {
        START_DATE = date;
        END_DATE = null;
      } else {
        END_DATE = date;
        this._finish({
          start: (START_DATE && START_DATE.getTime()) || undefined,
          end: (END_DATE && END_DATE.getTime()) || undefined
        });
        // this.setState({
        //   endDate: date
        // });
      }
      DateCell.update();
    } else {
      let { selectedTimes, selectedDate } = this.state;
      //默认选择一次
      const { pickTimes = 1 } = this.props;

      selectedDate.push(date.getTime());
      selectedTimes++;
      DateCell.update(
        selectedDate.map(d => {
          return {
            date: d
          };
        })
      );

      if (selectedTimes >= pickTimes) {
        this._finish({ selectDate: selectedDate });
      }
    }
  };
  private _finish(info: {
    start?: number;
    end?: number;
    selectDate?: number[];
  }) {
    setTimeout(() => {
      this.props.onFinish && this.props.onFinish(info);
      this.state.selectedTimes = 0;
      this.state.selectedDate = [];
    }, 1000);
  }
}

const styles = createStyle(theme => {
  const color = '#e10000';
  const paddingHorizontal = 0;
  const contentWidth = vw(100) - paddingHorizontal * 2;
  const contentHeight = '100%'; //dateCellHeight * 6 + 36 + 20;
  const deteRowMarginBottom = 4;
  const CELL_RECT = 27;
  return {
    wrapper: {
      backgroundColor: '#fff',
      height: contentHeight,
      justifyContent: 'center',
      alignItems: 'center'
    },
    dateRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal
    },
    dateCell: {
      width: contentWidth / 7,
      height: CELL_RECT,
      marginVertical: (dateCellHeight - CELL_RECT) / 2,
      overflow: 'hidden',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
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
    dateCellIIsStart: {
      borderTopLeftRadius: CELL_RECT / 2,
      borderBottomLeftRadius: CELL_RECT / 2,
      borderLeftWidth: 0,
      marginLeft: (contentWidth / 7 - CELL_RECT) / 2,
      backgroundColor: '#82704A',
      borderRightColor: '#82704A'
    },
    dateCellIIsEnd: {
      backgroundColor: '#82704A',
      borderRightWidth: 0,
      marginRight: (contentWidth / 7 - CELL_RECT) / 2,
      borderLeftColor: '#82704A',
      width: CELL_RECT + (contentWidth / 7 - CELL_RECT) / 2,
      borderTopRightRadius: CELL_RECT / 2,
      borderBottomRightRadius: CELL_RECT / 2
    },
    dateCellContent: {
      // flex: 1,
      width: CELL_RECT,
      borderRadius: CELL_RECT / 2,
      backgroundColor: '#F4F5F7',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dateCellContentBetween: {
      backgroundColor: '#82704A'
    },
    dateCellContentStart: {
      backgroundColor: '#82704A'
    },
    dateCellText: {
      color: '#282828',
      fontSize: 13
    },
    dateCellTextTip: {
      fontSize: theme.f1
    },
    dateCellSelected: {
      backgroundColor: '#82704A'
      // borderRadius: 8
    },
    dateCellEnd: {
      backgroundColor: '#282828'
    },
    dateContent: {
      flex: 1
    },
    today: {
      backgroundColor: '#e10000'
    },
    week: {
      flexDirection: 'row',
      paddingHorizontal
    },
    dateContentWrapper: {
      flex: 1
    },
    weekCell: {
      width: contentWidth / 7,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center'
    },
    weekText: {
      color: '#B6B7B8',
      fontSize: 11
    },
    dateSelected: {
      color: '#fff'
    },
    dateBetween: {
      backgroundColor: '#82704A'
    },
    dateDisabled: {
      color: '#ccc'
    },
    sectionHeader: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff'
    },
    sectionHeaderText: {
      color: '#28282844',
      fontSize: 19
    }
  };
});
export default DateList;
