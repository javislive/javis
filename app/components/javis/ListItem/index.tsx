import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native-ui';
import Application from 'celtics/Application';

function Item({
  children,
  title,
  onPress,
}: {
  children: any;
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={styles.wrapper}>
      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.right}>{children}</View>
      </View>
    </TouchableOpacity>
  );
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      height: 44,
      backgroundColor: '#fff',
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: 20,
      borderBottomWidth: theme.px,
      borderBottomColor: theme.borderColor,
    },
    left: {
      width: 96,
      justifyContent: 'center',
    },
    title: {
      fontSize: 14,
      color: theme.color,
    },
    right: {
      flex: 1,
    },
  };
});
export default Item;
