import React, { PureComponent, Fragment } from "react";
import { Text, TouchableOpacity, View } from "react-native-ui";

import Application from "celtics/Application";
import createStyles from './createStyles';

interface Props {
  data?: any;
  onHide?: () => void;
}

export default class Item extends PureComponent<Props> {
  render() {
    const { data = {}, onHide } = this.props;
    return (
      <Fragment>
        <View style={styles.content}>
          <Text style={styles.contentText}>{data.content}</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.okButton]}
            onPress={() => { onHide && onHide() }}
          >
            <Text style={[styles.buttonText, styles.okButtonText]}>好的</Text>
          </TouchableOpacity>
        </View>
      </Fragment>
    );
  }
}

const styles = Application.createStyle(theme => {
  return {
    ...createStyles(theme)
  };
});
