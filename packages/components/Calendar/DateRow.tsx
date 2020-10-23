import React, {
  PureComponent,
  // ReactElement,
} from 'react';
import {
  View,
  // Text,
  // TouchableOpacity,
  // SectionList,
} from 'react-native-ui';
import XDate from 'components/VisualDatePicker/XDate';
import { createStyle } from 'themes';
// import { vw, resize } from 'utils/resize';
import DateCell from './DateCell';
import OrderList from './OrderList';
import WorkList from './WorkList';
import Context from './Context';
const { Consumer } = Context;

interface DateRowProps {
  items: XDate[];
}
export default class DateRow extends PureComponent<DateRowProps> {
  render() {
    const { items } = this.props;
    return (
      <Consumer>
        {({
          selectedRow,
          type
        }: any) => {
          return (
            <View>
              <View style={styles.dateRow}>
                <DateCell date={items[0]} parent={this} />
                <DateCell date={items[1]} parent={this} />
                <DateCell date={items[2]} parent={this} />
                <DateCell date={items[3]} parent={this} />
                <DateCell date={items[4]} parent={this} />
                <DateCell date={items[5]} parent={this} />
                <DateCell date={items[6]} parent={this} />
              </View>
              {
                selectedRow === this && (
                  type === 'work' ? <WorkList /> : <OrderList />
                )
              }
            </View>
          );
        }}
      </Consumer>
    );
  }
}

const styles = createStyle(theme => {
  const dateCellHeight = 60;
  const paddingHorizontal = 0;
  const CELL_RECT = 27;
  return {
    dateRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal,
      marginTop: (dateCellHeight - CELL_RECT) / 1.5,
    },
  };
});