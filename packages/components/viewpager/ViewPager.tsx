"use strict";

import ViewPagerNative, {
  ViewPagerProps
} from "@react-native-community/viewpager";

class ViewPager extends ViewPagerNative {
  _setPageWithoutAnimation: any;
  _setPage: any;
  constructor(props: ViewPagerProps) {
    super(props);

    this._setPageWithoutAnimation = this.setPageWithoutAnimation;
    this._setPage = this.setPage;
    this.setPageWithoutAnimation = function(position) {
      this._setPageWithoutAnimation(position);
      this.props.onPageSelected &&
        this.props.onPageSelected({ nativeEvent: { position } });
    };
    this.setPage = function(position) {
      this._setPage(position);
      this.props.onPageSelected &&
        this.props.onPageSelected({ nativeEvent: { position } });
    };
  }
}
export default ViewPager;
