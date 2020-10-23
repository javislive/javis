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
export default class TitleBar extends PureComponent<Props> {
  render() {
    const { select, titles, onSelected } = this.props;
    const selectedStyle = {
      borderBottomColor: "#82704A",
      borderBottomWidth: 2
    };
    return (
      <View style={styles.header}>
        {titles.map(({ title, key }, index) => {
          const isSelected = select === key;

          return (
            <View
              key={key}
              style={[styles.headerItem, isSelected ? selectedStyle : null]}
            >
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => this._select({ title, key }, index)}
              >
                <Text
                  style={[
                    styles.title,
                    isSelected ? { color: "#82704A" } : null
                  ]}
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
    if (item.key === this.props.select) {
      return;
    } else {
      this.props.onSelected && this.props.onSelected(item, index);
    }
  }
  _renderContent() {}
}

const styles = createStyle(theme => {
  return {
    header: {
      height: resize(52),
      flexDirection: "row"
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
      fontSize: resize(18),
      color: theme.color
    },
    line: {
      width: resize(4),
      backgroundColor: theme.borderColor
    }
  };
});
