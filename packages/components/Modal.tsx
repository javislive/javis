import React, { PureComponent } from 'react';

import { View, TouchableOpacity } from 'react-native-ui';
import { createPortal } from './Protal';

const { Portal, Component } = createPortal(function(children: any, props: any) {
  children = children || [];
  children = children.filter((item: any) => {
    return item.instProps.visible;
  });
  if (children.length == 0) {
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
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(120, 120, 120, 0.3)'
            }}
          >
            <TouchableOpacity
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                top: 0,
                left: 0
              }}
              onPress={child.instProps && child.instProps.onBackdropPress}
            ></TouchableOpacity>
            {child.children}
          </View>
        );
      })}
    </View>
  );
});

export { Portal as ModalPortal, Component as default };
