import React, { PureComponent } from 'react';
import { View } from 'react-native-ui';
import Application from 'celtics/Application';
import { indexOf } from 'lodash';
import Radio from './Radio';
import context from './context';
import { resize } from 'utils/resize';
const { Provider } = context;
interface GroupProps {
  style?: any;
  value?: any;
  disabled?: boolean;
  onChange?: (name?: any) => void;
  children?: JSX.Element[];
  selectedColor?: string;
  backgroundColor?: string;
  disabledColor?: string;
  options?: { name: any; label: string }[];
  multi?: boolean;
}

export default class RadioGroup extends PureComponent<GroupProps> {
  render() {
    const {
      style,
      options,
      children,
      value,
      disabled,
      selectedColor,
      backgroundColor,
      disabledColor,
      multi = false,
    } = this.props;

    return (
      <View style={[styles.wrapper, style]}>
        <Provider
          value={{
            value,
            disabled,
            selectedColor,
            backgroundColor,
            disabledColor,
            hasContext: true,
            onSelected: this._selectRadio,
            multi
          }}
        >
          {options ? this._renderOptions(options) : children}
        </Provider>
      </View>
    );
  }
  private _selectRadio = (name: any) => {
    const { onChange, value, multi } = this.props;
    if (onChange) {
      if (multi) {
        const newVal = value ? [...value] : [];
        const index = indexOf(value, name)
        if (index == -1) {
          newVal.push(name);
        } else {
          newVal.splice(index, 1);
        }
        onChange(newVal);
      } else {
        if (value == name) {
          onChange(null);
        } else {
          onChange(name);
        }
      }
    }
  };
  private _renderOptions(
    options: { name: any; label: string }[]
  ): JSX.Element[] {
    return options.map(({ name, label }) => {
      return (
        <Radio name={name} key={name} label={label} style={styles.radio} />
      );
    });
  }
}
const styles = Application.createStyle(() => {
  return {
    wrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    radio: {
      marginVertical: resize(14),
      marginRight: resize(14)
    }
  };
});
