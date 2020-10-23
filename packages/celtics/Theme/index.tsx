import BaseTheme, {ITheme} from './BaseTheme';

import StyleSheet from './StyleSheet';

export interface ThemeProviderProps {
  children: any;
  theme: any;
}

let THEME: ITheme = {...BaseTheme};

function addTheme(theme: ITheme) {
  THEME = Object.assign({}, THEME, theme);
  StyleSheet.addTheme(THEME);
  notifyThemeChange();
}
function clearTheme() {
  THEME = {...BaseTheme};
  StyleSheet.setTheme(THEME);
}
const THEME_CHANGE_LISTENERS: {[idx: string]: () => void} = {};
let THEME_LISTENER_KEY = 1;

function onThemeChange(l: () => void): string {
  const key = ++THEME_LISTENER_KEY + '';
  THEME_CHANGE_LISTENERS[key] = l;
  return key;
}
function removeThemeChange(key: string) {
  delete THEME_CHANGE_LISTENERS[key];
}
function notifyThemeChange() {
  const keys = Object.keys(THEME_CHANGE_LISTENERS);
  keys.forEach(key => {
    THEME_CHANGE_LISTENERS[key]();
  });
}
function createStyle<T>(styleCreator: (theme: ITheme) => T): T {
  return StyleSheet.create(styleCreator);
}
function getTheme(): ITheme {
  return THEME;
}
addTheme(BaseTheme);
export {
  createStyle,
  clearTheme,
  BaseTheme,
  onThemeChange,
  removeThemeChange,
  addTheme,
  ITheme,
  getTheme,
};
