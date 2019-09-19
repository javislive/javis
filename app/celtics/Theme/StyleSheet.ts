import { StyleSheet as SH } from "react-native";

const StyleSheet = Object.create(SH);
let _currentTheme: { [name: string]: any } = {};

let _updater: Promise<any> | undefined;
function addTheme(theme: any) {
  _currentTheme = Object.assign(_currentTheme, theme);
  return createStyleSheet();
}
function setTheme(theme: any) {
  _currentTheme = Object.assign(theme);
  return createStyleSheet();
}

const STYLE_CREATOR_LIST: (() => void)[] = [];

function createStyleSheet() {
  if (_updater) {
    return _updater;
  }
  _updater = new Promise(res => {
    setTimeout(() => {
      STYLE_CREATOR_LIST.forEach(f => {
        f();
      });
      _updater = undefined;
      res();
    }, 0);
  });
  return _updater;
}
StyleSheet.create = function<T>(styleCreator: (theme: any) => T): T {
  let id = STYLE_CREATOR_LIST.length;
  let _sh: T;
  let creator = function() {
    _sh = SH.create(styleCreator(_currentTheme));
  };
  STYLE_CREATOR_LIST.push(creator);

  creator();

  let sh: T = {};
  for (let o in _sh) {
    Object.defineProperty(sh, o, { get: () => _sh[o] });
  }
  return sh;
};

StyleSheet.addTheme = addTheme;
StyleSheet.setTheme = setTheme;
export default StyleSheet;
