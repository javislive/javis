import { Plugin } from 'celtics/Plugin';
import React, { RefObject, createRef } from 'react';
import Chooser from './Chooser';

export default class DatePicker extends Plugin<Payload> {
	private _chooserRef: RefObject<Chooser> = createRef();
	dispatch(action: string, payload?: any) {
		if (action == 'show' && payload) {
			this._chooserRef.current && this._chooserRef.current.show(payload);
		} else {
			this._chooserRef.current && this._chooserRef.current.close();
		}
	}
	render() {
		return <Chooser ref={this._chooserRef} />;
	}
}
