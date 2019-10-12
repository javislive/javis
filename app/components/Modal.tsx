import React, {PureComponent} from 'react';

import {View} from 'react-native-ui';
import {createPortal} from './Protal';

const {Portal, Component} = createPortal(function(children: any, props: any) {
  if (!children || children.length == 0) {
    return null;
  }
  return (
    <View style={props.style}>
      {children.map((child: any, index: number) => {
        return (
          <View
            key={index}
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              top: 0,
              left: 0,
            }}>
            {child}
          </View>
        );
      })}
    </View>
  );
});

export {Portal as ModalPortal, Component as default};
