import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>
  children: React.ReactNode | React.ReactNodeArray ,
}

export default class SwipeableQuickActions extends React.Component<Props>  {
  render(): React.ReactNode {
    const children = this.props.children;
    let buttons = [];

    // Multiple children
    if (children instanceof Array) {
      for (let i = 0; i < children.length; i++) {
        buttons.push(children[i]);

        if (i < children.length - 1) {
          // Not last button
          buttons.push(<View key={i} style={styles.divider} />);
        }
      }
    } else {
      // 1 child
      buttons = children;
    }

    return <View style={[styles.background, this.props.style]}>{buttons}</View>;
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  divider: {
    width: 4,
  },
});
