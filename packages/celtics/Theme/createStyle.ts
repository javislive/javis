import BaseTheme, { ITheme } from "./BaseTheme";

import StyleSheet from "react-native-theme-stylesheet";

function createStyle<T>(styleCreator: (theme: ITheme) => T): T {
  return StyleSheet.create(styleCreator);
}

export default createStyle;
