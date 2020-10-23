import React, { PureComponent } from "react";
import Application from "celtics/Application";
import { Text, View, TouchableOpacity } from "react-native-ui";
import FontIcon from 'components/FontIcon';
import Modal from "components/Modal";
import List from 'pages/bridal/MyWork/List';
import Content from './Content';
import Progress from './Progress';
import createStyles from './createStyles';
import { resize } from 'utils/resize';

interface Props {
  data?: any;
  modalType?: string;
  onFinish?: () => void;
}

export default class WorkProgress extends PureComponent<Props> {
  state = {
    show: false,
    data: {},
    modalType: null,
  };

  static getDerivedStateFromProps(props: any) {
    if ('data' in props) {
      return {
        data: props.data || {}
      }
    }
    return null;
  }

  show(modalType: any, data: any) {
    this.setState({
      show: true,
      modalType,
      data,
    });
  }

  hide() {
    this.setState({ show: false });
  }

  render() {
    const { show, modalType, data } = this.state;
    const { onFinish } = this.props;
    return (
      <Modal visible={show} onBackdropPress={() => this.hide()}>
        {
          show
          && (
            <TouchableOpacity style={styles.main}>
              <View style={styles.header}>
                <Text style={styles.title}>{data.title}</Text>
                <TouchableOpacity style={styles.removeIcon} onPress={() => this.hide()}>
                  <FontIcon icon="&#xe781;" size={resize(20)} />
                </TouchableOpacity>
              </View>
              {
                modalType === List.MODAL_TYPE.CONTENT ?
                  (
                    <Content
                      data={data}
                      onHide={() => this.hide()}
                    />
                  )
                  : (
                    <Progress
                      data={data}
                      onHide={() => this.hide()}
                      onFinish={onFinish}
                    />
                  )
              }
            </TouchableOpacity>
          )
        }
      </Modal>
    );
  }
}

const styles = Application.createStyle(theme => {
  return {
    ...createStyles(theme),
    removeIcon: {
      position: 'absolute',
      top: resize(0),
      right: resize(0),
      height: resize(30),
      width: resize(30),
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});
