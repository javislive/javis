import {Dimensions, PixelRatio} from 'react-native';

let widthDP = 375;
let widthPX = 1080;
const PIXEL_RATIO = 2;
const REAL_PIXEL_RATIO = PixelRatio.get();
const REAL_WIDTH_DP = Dimensions.get('window').width;
const REAL_HEIGHT_DP = Dimensions.get('window').height;
let ratio: number = REAL_WIDTH_DP / widthDP;

/**
 *
 * @param px
 */
export function px2dp(px: number): number {
  return PixelRatio.roundToNearestPixel(px / REAL_PIXEL_RATIO);
}

/**
 *
 * @param dp
 */
export function dp2px(dp: number): number {
  return PixelRatio.getPixelSizeForLayoutSize(dp);
}

/**
 *
 * @param dp
 */
export function resize(dp: number): number {
  return PixelRatio.roundToNearestPixel(dp * ratio);
}

/**
 *
 * @param width
 */
export function setDeviceWidth(width: number) {
  widthDP = width;
  widthPX = width * REAL_PIXEL_RATIO;
  ratio = REAL_WIDTH_DP / widthDP;
}

/**
 *
 * @param v
 */
export function vm(v: number): number {
  return REAL_HEIGHT_DP > REAL_WIDTH_DP ? vw(v) : vh(v);
}

/**
 *
 * @param v
 */
export function vh(v: number): number {
  return (REAL_HEIGHT_DP / 100) * v;
}

/**
 *
 * @param v
 */
export function vw(v: number): number {
  return (REAL_WIDTH_DP / 100) * v;
}
