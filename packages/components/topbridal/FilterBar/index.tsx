import React, { PureComponent } from "react";
import { Text, TouchableOpacity, View } from "react-native-ui";
import { resize, vh, vw } from "utils/resize";

import { createStyle } from "themes";

interface SelectTitle {
  title: string;
  key: string;
}
interface Props {
  select: string;
  onSelected: (item: SelectTitle, index: number) => void;
  titles: SelectTitle[];
}
export default class FilterBar extends PureComponent<Props> {
  render() {
    const { select, titles, onSelected } = this.props;
    const selectedStyle = {
      color: "#82704A"
    };
    return (
      <View style={styles.header}>
        {titles.map(({ title, key }, index) => {
          return (
            <View key={key} style={[styles.headerItem]}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => this._select({ title, key }, index)}
              >
                <Text
                  style={[styles.title, select === key ? selectedStyle : null]}
                >
                  {title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
  _select(item: SelectTitle, index: number) {
    this.props.onSelected && this.props.onSelected(item, index);
    // if (item.key === this.props.select) {
    //   return;
    // } else {
    // }
  }
  _renderContent() {}
}

const styles = createStyle(theme => {
  return {
    header: {
      height: resize(58),
      flexDirection: "row",
      backgroundColor: "#fff"
    },
    headerItem: {
      flex: 1,
      flexDirection: "row"
    },
    headerButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    title: {
      fontSize: resize(20),
      color: "#282828"
    },
    line: {
      width: theme.px,
      backgroundColor: theme.borderColor
    }
  };
});
