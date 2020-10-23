import { Plugin } from 'celtics/Plugin';
import React, { RefObject, createRef } from 'react';
import DatePickerT, { Payload } from 'components/topbridal/DatePicker';

export default class DatePicker extends Plugin<Payload> {
  private _datePicker: RefObject<DatePickerT> = createRef();
  dispatch(action: string, payload?: Payload) {
    if (action == 'show' && payload) {
      this._datePicker.current && this._datePicker.current.show(payload);
    } else {
      this._datePicker.current && this._datePicker.current.close();
    }
  }
  render() {
    return <DatePickerT ref={this._datePicker} />;
  }
}
