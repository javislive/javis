import { View, Text } from 'react-native-ui';

import React from 'react';
import Application from 'celtics/Application';
import { resize } from 'utils/resize';

export interface Props {
  columnStyle?: <T = any>(data: ColumnData) => T;
  rowStyle?: <T = any>(data: {
    itemIndex: number;
    item: any;
    source: any;
  }) => T;
  headerColumnStyle?: <T = any>(data: {
    index: number;
    title?: string | JSX.Element;
  }) => T;
  contentContainer?: React.ComponentClass;
  children?: React.ReactElement<ColumnProps>[];
  source?: any[];
  style?: any;
  headerStyle?: any;
  contentStyle?: any;
}

interface ColumnProps {
  title?: string | JSX.Element;
  prop?: string;
  width?: number;
  flex?: number;
  children?:
    | JSX.Element
    | JSX.Element[]
    | ((data: ColumnData) => JSX.Element | JSX.Element[]);
}

interface ColumnData extends ColumnProps {
  itemIndex?: number;
  item?: any;
  index?: number;
  source?: any;
}
function Td({
  title,
  prop,
  children,
  width,
  style,
  flex,
  type,
  index,
  itemIndex,
  item,
  source,
}: ColumnData & { type: 'thd' | 'td'; style?: any }) {
  const child =
    type === 'thd' ? title : children ? children : prop ? item[prop] : '';
  return (
    <View
      style={[
        style,
        {
          width,
          flex,
        },
      ]}
    >
      {child ? (
        typeof child === 'string' ? (
          <Text style={type === 'thd' ? styles.thdText : styles.tdText}>
            {child}
          </Text>
        ) : typeof child === 'function' ? (
          child({
            prop,
            index,
            itemIndex,
            item,
            source,
            title,
          })
        ) : (
          child
        )
      ) : null}
    </View>
  );
}

function Tr({
  source,
  style,
  item,
  tdSource,
}: {
  source?: any;
  tdSource?: (ColumnData & { style: any })[];
  style?: any;
  item?: any;
  itemIndex: number;
}) {
  return (
    <View style={style}>
      {tdSource
        ? tdSource.map(
            ({
              title,
              index,
              width,
              flex,
              style,
              itemIndex,
              children,
              prop,
            }) => {
              return (
                <Td
                  key={index}
                  type="td"
                  title={title}
                  index={index}
                  width={width}
                  flex={flex}
                  source={source}
                  item={item}
                  prop={prop}
                  itemIndex={itemIndex}
                  children={children}
                  style={[styles.td, style]}
                />
              );
            }
          )
        : null}
    </View>
  );
}
interface ThdProps {
  title?: string | JSX.Element;
  style?: any;
  index: number;
  width?: number;
  flex?: number;
}
function Th({ source, style }: { source?: ThdProps[]; style?: any }) {
  return (
    <View style={[style]}>
      {source
        ? source.map(({ title, index, width, flex, style }) => {
            return (
              <Td
                key={index}
                type="thd"
                title={title}
                index={index}
                width={width}
                flex={flex}
                style={[styles.td, style]}
              />
            );
          })
        : null}
    </View>
  );
}

export function Column(prop: ColumnProps) {
  return null;
}

export default function Table({
  children,
  columnStyle,
  rowStyle,
  headerStyle,
  headerColumnStyle,
  contentStyle,
  contentContainer: C = View,
  source,
  style,
}: Props) {
  if (!children) {
    return null;
  }
  const h: ThdProps[] = [];
  const cn: ColumnData[] = [];
  React.Children.forEach(
    children,
    ({ props: { title, prop, children, flex, width } }, index) => {
      h.push({
        title,
        index,
        flex,
        width,
        style: headerColumnStyle ? headerColumnStyle({ index, title }) : null,
      });
      cn.push({
        title,
        index,
        prop,
        flex,
        width,
        children,
      });
    }
  );
  return (
    <View style={[styles.main, style]}>
      <Th source={h} style={[styles.header, headerStyle]} />
      <C style={contentStyle}>
        {source
          ? source.map((item, index) => {
              return (
                <Tr
                  key={index}
                  tdSource={cn.map((data) => {
                    return {
                      ...data,
                      style: columnStyle
                        ? columnStyle({
                            ...data,
                            itemIndex: index,
                            source,
                            item,
                          })
                        : null,
                      itemIndex: index,
                      source,
                      item,
                    };
                  })}
                  source={source}
                  item={item}
                  itemIndex={index}
                  style={[
                    styles.tr,
                    index % 2 === 1 ? styles.trodd : null,
                    rowStyle
                      ? rowStyle({ itemIndex: index, item, source })
                      : null,
                  ]}
                />
              );
            })
          : null}
      </C>
    </View>
  );
}

const styles = Application.createStyle((theme) => {
  return {
    main: {
      backgroundColor: '#fff',
    },
    header: {
      height: resize(35),
      backgroundColor: '#4A4A4A',
      flexDirection: 'row',
    },
    td: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    thdText: {
      fontSize: resize(9),
      color: '#fff',
    },
    tdText: {
      fontSize: resize(9),
      color: '#3B3E42',
    },
    tr: {
      height: resize(23),
      backgroundColor: '#FFFFFF',
      borderBottomColor: '#EFF1F5',
      borderBottomWidth: theme.px,
      flexDirection: 'row',
    },
    trodd: {
      backgroundColor: '#F4F5F7',
    },
  };
});
