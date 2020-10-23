import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Text } from 'react-native-ui';
import Application from 'celtics/Application';
import { resize } from 'utils/resize';
import { indexOf } from 'lodash'
import context from './context';
const { Consumer } = context;
export interface Props {
  name: any;
  value?: any;
  onSelected?: (name: any) => void;
  label?: string;
  children?: JSX.Element;
  selectedColor?: string;
  backgroundColor?: string;
  disabled?: boolean;
  disabledColor?: string;
  style?: any;
}
export default class Radio extends PureComponent<Props> {
  render() {
    let {
      name,
      value,
      label,
      children,
      selectedColor = '#3A3A3A',
      backgroundColor,
      style,
      onSelected,
      disabled,
      disabledColor
    } = this.props;
    
    return (
      <Consumer>
        {({
          hasContext,
          selectedColor: sColor,
          backgroundColor: bColor,
          disabled: d,
          disabledColor: dColor,
          value: v,
          onSelected: selected,
          multi,
        }: any) => {
          value = hasContext ? v : value;
          selectedColor = selectedColor || sColor;
          disabled = hasContext ? d : disabled;
          disabledColor = disabledColor || dColor;
          backgroundColor = backgroundColor || bColor;
          onSelected = hasContext ? selected : onSelected;
          const isSelected = (hasContext && multi) ? indexOf(value, name) != -1 : name === value;
          return (
            <TouchableOpacity
              style={[styles.wrapper, style]}
              activeOpacity={1}
              onPress={
                !disabled
                  ? () => {
                      this._onPress(onSelected);
                    }
                  : null
              }
            >
              <View
                style={[
                  styles.button,
                  backgroundColor ? { backgroundColor } : null
                ]}
              >
                <View
                  style={[
                    styles.inner,
                    isSelected
                      ? {
                          backgroundColor: disabled
                            ? disabledColor
                            : selectedColor
                        }
                      : { backgroundColor: 'transparent' }
                  ]}
                ></View>
              </View>
              {children ? (
                children
              ) : (
                <View>
                  <Text style={styles.labelText}>{label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      </Consumer>
    );
  }
  private _onPress = (onSelected?: (v: any) => void) => {
    const { name } = this.props;
    onSelected && onSelected(name);
  };
}

const styles = Application.createStyle(theme => {
  return {
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    button: {
      height: resize(14),
      width: resize(14),
      borderRadius: resize(14),
      backgroundColor: '#D8D8D8',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: resize(8)
    },
    inner: {
      height: resize(7),
      width: resize(7),
      borderRadius: resize(7),
      backgroundColor: '#3A3A3A'
    },
    labelText: {
      color: '#4A4A4A',
      fontSize: resize(14)
    }
  };
});
