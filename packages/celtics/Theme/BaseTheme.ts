import { Dimensions, Platform } from "react-native";
import { px2dp, resize, vh, vw } from "utils/resize";

const IOS = Platform.OS === "ios";
const clientWidth = Dimensions.get("window").width;

export interface ITheme {
  f1?: number;
  f2?: number;
  f3?: number;
  f14?: number;
  f4?: number;
  f5?: number;
  f6?: number;
  color?: string;
  themeColor?: string;
  fadeColor?: string;
  px?: number;
  clientWidth?: number;

  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  itemHeightM?: number;
  itemHeightL?: number;
  itemHeightH?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  paddingHorizontal?: number;
  placeholderColor?: string;
  disabledColor?: string;

  /**
   * navigationHeader style
   */
  navigationHeaderHeight?: number;
  navigationHeaderMarginTop?: number;
  navigationHeaderPaddingTop?: number;
  navigationHeaderBackgroundColor?: string;
  navigationHeaderColor?: string;
  navigationHeaderFontSize?: number;
  navigationHeaderButtonMargin?: number;
  navigationHeaderButtonWidth?: number;
  /**
   * navigationHeader style end
   */

  pageWrapper?: any;
  boxShadow?: any;
  /**
   * toast style
   */
  toastWrapper?: any;
  toastText?: any;
  [key: string]: any;
}
const BaseTheme: ITheme = {
  f1: 12,
  f2: 14,
  f3: 16,
  f14: 18,
  f4: 20,
  f5: 22,
  f6: 24,
  color: "#333",
  clientWidth,
  themeColor: "#82704A",
  fadeColor: "#A3A3A3",
  px: px2dp(1),
  backgroundColor: "#EFEFF3",
  borderColor: "#D8D8D8",
  itemHeightM: 48,
  itemHeightL: 36,
  itemHeightH: 60,
  defaultWidth: 240,
  defaultHeight: 34,
  paddingHorizontal: 16,
  placeholderColor: "#D1D1D6",
  disabledColor: "#ccc",

  navigationHeaderHeight: 44,
  navigationHeaderMarginTop: 20,
  navigationHeaderPaddingTop: 0,
  navigationHeaderBackgroundColor: "#fff",
  navigationHeaderColor: "#333",
  navigationHeaderFontSize: 14,
  navigationHeaderButtonMargin: 10,
  navigationHeaderButtonWidth: 90,

  pageWrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#EFEFF3",
    paddingTop: 35
  },
  boxShadow: {
    shadowColor: "#ccc",
    shadowRadius: 3,
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.45
  },

  toastWrapper: {
    backgroundColor: "#333333AA",
    height: resize(36),
    borderRadius: resize(18),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: vh(60),
    width: vw(75),
    left: vw(12.5),
    overflow: "hidden"
  },
  toastText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center"
  }
};

export default BaseTheme;
