import { ITheme } from "themes/BaseTheme";
import { PureComponent } from "react";

export default class ThemeComponent<
  P = {},
  C = {},
  T = {}
> extends PureComponent<P, C> {
  componentWillUnmount = () => {};
}
