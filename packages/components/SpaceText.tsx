import { Text, View } from 'react-native-ui';

import React from 'react';

export default function SpaceText({
  style,
  textStyle,
  text,
  append = ''
}: {
  style?: object;
  text: string;
  append?: string;
  textStyle?: object;
}) {
  const ts = text.split('');
  return (
    <View
      style={[style, { flexDirection: 'row', justifyContent: 'space-between' }]}
    >
      {ts.map((t, i) => {
        t = i === ts.length - 1 ? t + append : t;
        return (
          <Text key={t} style={textStyle}>
            {t}
          </Text>
        );
      })}
    </View>
  );
}
