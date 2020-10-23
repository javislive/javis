import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Application from 'celtics/Application';
import Modal from 'components/Modal';
import { resize, vw } from 'utils/resize';

interface Props {}
export default class Displayer extends PureComponent<Props> {
  render() {
    return (
      <Modal visible={true} onBackdropPress={() => this.close()}>
        <View style={styles.wrapper}></View>
      </Modal>
    );
  }
  private close() {}
}

const styles = Application.createStyle((theme) => {
  return {
    wrapper: {
      height: resize(120),
      width: vw(70),
    },
  };
});
