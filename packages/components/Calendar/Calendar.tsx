import React from 'react'; // ReactElement, // PureComponent,
import { Text, View, TouchableOpacity, SectionList } from 'react-native-ui';

import { isEmpty, indexOf } from 'lodash';
import { VisualDatePicker } from 'components/VisualDatePicker';
import XDate from 'components/VisualDatePicker/XDate';
import { createStyle } from 'themes';
import { vw, resize } from 'utils/resize';
import { dispatch } from "febrest";
import common from "actions/common";
import DateRow from './DateRow';
import DateCell from './DateCell';
import Context from './Context';
const { Provider } = Context;

export interface Props {
  activeDates?: any;
  data?: any;
  didMount?: () => void;
  type: string;
  params?: object;
}
let now = new XDate();
now = new XDate(now.getFullYear(), now.getMonth(), now.getDate());

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

export default class Calendar extends VisualDatePicker<Props> {
  static defaultProps = {
    start: now.getTime() - 2592000000,
    // start: now.getTime(),
    end: now.nextYear() || now.getTime() + 86399999
  };

  state = {
    sections: null,
    selectedRow: null,
    selectedDate: null,
    dateDetail: null,
    itemPostion: null,
    start: 0,
    end: 0,
    listKey: Date.now()
  };

  constructor(props: Props) {
    super(props);
    const { start, end } = this.initDateBound();
    this.state.start = start;
    this.state.end = end;
  }

  componentWillUnmount() {
    DateCell.cells = {};
    DateCell.activeCells = [];
  }

  componentDidMount() {
    const { didMount } = this.props;
    didMount && didMount(this.state.start, this.state.end);
    DateCell.update(this.props.activeDates, this.props.data);
  }

  componentWillReceiveProps(nextProps: any) {
    DateCell.update(nextProps.activeDates, nextProps.data);
  }

  _makeSections() {
    const { start = 0, end = 0 } = this.state;
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

  _renderItem = ({ item }) => {
    return <DateRow items={item} />;
  };

  onDateClick = (date: XDate, dateRow: any, itemPostion: any) => {
    const { data, type } = this.props;
    if (type === 'work') {
      if (data && !isEmpty(data)) {
        const selectedDate = new XDate(date).format();
        const dateDetail = data[selectedDate];
        this.setState({
          selectedRow: dateRow,
          selectedDate,
          itemPostion,
          dateDetail
        });
      }
    } else if (type === 'product') {
      const selectedDate = new XDate(date).format();
      const { activeDates } = this.props;
      if (indexOf(activeDates, selectedDate) != -1) {
        this._getOrders(selectedDate).then(res => {
          this.setState({
            selectedRow: dateRow,
            selectedDate,
            itemPostion,
            dateDetail: res ? [res] : []
          });
        })
      }
    }
  };

  _getOrders = (event_at: any) => {
    const { params } = this.props;
    return dispatch(common.getOrderSelectDate, {
      sn: params.sn,
      event_at,
    });
  }

  render() {
    let {
      sections,
      selectedRow,
      selectedDate,
      dateDetail,
      itemPostion,
      start,
      listKey,
    } = this.state;
    const { type } = this.props;
    if (!sections) {
      sections = this._makeSections();
      this.state.sections = sections;
    }
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text
            style={[styles.headerText, { flex: 1, marginLeft: resize(20) }]}
          >
            {new XDate(start).format('yyyy') + '年'}
          </Text>
          <TouchableOpacity style={styles.yearButton} onPress={this.setPreYear}>
            <Text style={styles.headerText}>上一年</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.yearButton}
            onPress={this.setNextYear}
          >
            <Text style={styles.headerText}>下一年</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.yearButton, { marginRight: resize(40) }]}
            onPress={this.setCurrentYear}
          >
            <Text style={styles.headerText}>今年</Text>
          </TouchableOpacity>
        </View>
        <Provider
          value={{
            selectedRow,
            selectedDate,
            dateDetail,
            onDateClick: this.onDateClick,
            itemPostion,
            type,
          }}
        >
          <SectionList
            key={listKey}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            style={styles.dateContentWrapper}
            sections={sections}
            getItemCount={() => sections.length}
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
            onViewableItemsChanged={() => {
              DateCell.update(this.props.activeDates, this.props.data);
            }}
          />
        </Provider>
        <View style={{ height: 30 }} />
      </View>
    );
  }
  private setCurrentYear = () => {
    const date = new XDate(Date.now()).firstDateOfYear();
    const start = date.getTime();
    const end = date.nextYear().getTime();
    this.setState({
      start,
      end,
      sections: null,
      selectedRow: null,
      listKey: Date.now(),
    }, () => {
      const { didMount } = this.props;
      didMount && didMount(this.state.start, this.state.end);
    });
  };
  private setNextYear = () => {
    const { start: time } = this.state;
    const date = new XDate(time).firstDateOfYear();
    date.nextYear();
    const start = date.getTime();
    const end = date.nextYear().getTime();
    this.setState({
      start,
      end,
      sections: null,
      selectedRow: null,
      listKey: Date.now(),
    }, () => {
      const { didMount } = this.props;
      didMount && didMount(this.state.start, this.state.end);
    });
  };
  private setPreYear = () => {
    const { start: time } = this.state;
    const date = new XDate(time).firstDateOfYear();
    date.preYear();
    const start = date.getTime();
    const end = date.nextYear().getTime();
    this.setState({
      start,
      end,
      sections: null,
      selectedRow: null,
      listKey: Date.now(),
    }, () => {
      const { didMount } = this.props;
      didMount && didMount(this.state.start, this.state.end);
    });
  };
  /**
   * 初始化日期范围
   * 有start 以start为准取一年
   * 有end 以end为准取一年
   * 否则以selectDate为准取一年
   * 都没有取今年
   * */

  private initDateBound(
    start?: number,
    end?: number,
    selectDate?: { date: number; backgroundColor?: string }[]
  ) {
    const time =
      start || end || (selectDate && selectDate[0].date) || Date.now();
    const date = new XDate(time).firstDateOfYear();
    const startDate = date.getTime();
    const endDate = date.nextYear().getTime();
    return {
      start: startDate,
      end: endDate
    };
  }
}

const styles = createStyle(theme => {
  const paddingHorizontal = 0;
  const contentWidth = vw(100) - paddingHorizontal * 2;
  const contentHeight = '100%';
  return {
    wrapper: {
      backgroundColor: '#F4F5F7',
      height: contentHeight,
      justifyContent: 'center',
      alignItems: 'center'
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
    sectionHeader: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F4F5F7'
    },
    sectionHeaderText: {
      color: '#28282844',
      fontSize: 19
    },
    header: {
      borderBottomWidth: theme.px,
      borderColor: theme.borderColor,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: resize(36)
    },
    yearButton: {
      marginLeft: resize(10),
      width: resize(80),
      height: resize(30),
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#82704A',
      borderWidth: theme.px,
      borderRadius: resize(30)
    },
    headerText: {
      color: theme.color,
      fontSize: resize(15)
    }
  };
});
