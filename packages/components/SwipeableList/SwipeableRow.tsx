import React from 'react';
import {
  Animated,
  I18nManager,
  StyleSheet,
  View,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';

const IS_RTL = I18nManager.isRTL;

// NOTE: Eventually convert these consts to an input object of configurations

// Position of the left of the swipable item when closed
const CLOSED_LEFT_POSITION = 0;
// Minimum swipe distance before we recognize it as such
const HORIZONTAL_SWIPE_DISTANCE_THRESHOLD = 10;
// Minimum swipe speed before we fully animate the user's action (open/close)
const HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD = 0.3;
// Factor to divide by to get slow speed; i.e. 4 means 1/4 of full speed
const SLOW_SPEED_SWIPE_FACTOR = 4;
// Time, in milliseconds, of how long the animated swipe should be
const SWIPE_DURATION = 300;

/**
 * On SwipeableListView mount, the 1st item will bounce to show users it's
 * possible to swipe
 */
const ON_MOUNT_BOUNCE_DELAY = 700;
const ON_MOUNT_BOUNCE_DURATION = 400;

// Distance left of closed position to bounce back when right-swiping from closed
const RIGHT_SWIPE_BOUNCE_BACK_DISTANCE = 30;
const RIGHT_SWIPE_BOUNCE_BACK_DURATION = 300;
/**
 * Max distance of right swipe to allow (right swipes do functionally nothing).
 * Must be multiplied by SLOW_SPEED_SWIPE_FACTOR because gestureState.dx tracks
 * how far the finger swipes, and not the actual animation distance.
 */
const RIGHT_SWIPE_THRESHOLD = 30 * SLOW_SPEED_SWIPE_FACTOR;
const DEFAULT_SWIPE_THRESHOLD = 30;

const emptyFunction = () => { };

interface Props {
  children?: React.ReactNode | React.ReactNodeArray,
  isOpen?: boolean,
  maxSwipeDistance?: number,
  onClose?: () => void,
  onOpen?: () => void,
  onSwipeEnd?: () => void,
  onSwipeStart?: () => void,
  preventSwipeRight?: boolean,
  shouldBounceOnMount?: boolean,
  slideoutView?: React.ReactNode,
  swipeThreshold?: number,
};

interface State {
  currentLeft: Animated.Value,
  isSwipeableViewRendered: boolean,
  rowHeight: number,
  rowWidth: number,
};

export default class SwipeableRow extends React.Component<Props, State> {
  _handleMoveShouldSetPanResponderCapture = (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ): boolean => {
    // Decides whether a swipe is responded to by this component or its child
    return gestureState.dy < 10 && this._isValidSwipe(gestureState);
  };

  _handlePanResponderGrant = (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ): void => { };

  _handlePanResponderMove = (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ): void => {
    if (this._isSwipingExcessivelyRightFromClosedPosition(gestureState)) {
      return;
    }

    this.props.onSwipeStart && this.props.onSwipeStart();

    if (this._isSwipingRightFromClosed(gestureState)) {
      this._swipeSlowSpeed(gestureState);
    } else {
      this._swipeFullSpeed(gestureState);
    }
  };

  _onPanResponderTerminationRequest = (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ): boolean => {
    return false;
  };

  _handlePanResponderEnd = (
    event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ): void => {
    const horizontalDistance = IS_RTL ? -gestureState.dx : gestureState.dx;
    if (this._isSwipingRightFromClosed(gestureState)) {
      this.props.onOpen && this.props.onOpen();
      this._animateBounceBack(RIGHT_SWIPE_BOUNCE_BACK_DURATION);
    } else if (this._shouldAnimateRemainder(gestureState)) {
      if (horizontalDistance < 0) {
        // Swiped left
        this.props.onOpen && this.props.onOpen();
        this._animateToOpenPositionWith(gestureState.vx, horizontalDistance);
      } else {
        // Swiped right
        this.props.onClose && this.props.onClose();
        this._animateToClosedPosition();
      }
    } else {
      if (this._previousLeft === CLOSED_LEFT_POSITION) {
        this._animateToClosedPosition();
      } else {
        this._animateToOpenPosition();
      }
    }

    this.props.onSwipeEnd && this.props.onSwipeEnd();
  };

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: this
      ._handleMoveShouldSetPanResponderCapture,
    onPanResponderGrant: this._handlePanResponderGrant,
    onPanResponderMove: this._handlePanResponderMove,
    onPanResponderRelease: this._handlePanResponderEnd,
    onPanResponderTerminationRequest: this._onPanResponderTerminationRequest,
    onPanResponderTerminate: this._handlePanResponderEnd,
    onShouldBlockNativeResponder: (event, gestureState) => false,
  });

  _previousLeft = CLOSED_LEFT_POSITION;
  _timeoutID = null;

  state = {
    currentLeft: new Animated.Value(this._previousLeft),
    /**
     * In order to render component A beneath component B, A must be rendered
     * before B. However, this will cause "flickering", aka we see A briefly
     * then B. To counter this, _isSwipeableViewRendered flag is used to set
     * component A to be transparent until component B is loaded.
     */
    isSwipeableViewRendered: false,
    rowHeight: null,
    rowWidth: null,
  };

  componentDidMount(): void {
    if (this.props.shouldBounceOnMount) {
      /**
       * Do the on mount bounce after a delay because if we animate when other
       * components are loading, the animation will be laggy
       */
      this._timeoutID = setTimeout(() => {
        this._animateBounceBack(ON_MOUNT_BOUNCE_DURATION);
      }, ON_MOUNT_BOUNCE_DELAY);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    /**
     * We do not need an "animateOpen(noCallback)" because this animation is
     * handled internally by this component.
     */
    const isOpen = this.props.isOpen ?? false;
    const nextIsOpen = nextProps.isOpen ?? false;

    if (isOpen && !nextIsOpen) {
      this._animateToClosedPosition();
    }
  }

  componentWillUnmount() {
    if (this._timeoutID != null) {
      clearTimeout(this._timeoutID);
    }
  }

  render(): React.ReactElement<any> {
    // The view hidden behind the main view
    let slideOutView;
    const { isSwipeableViewRendered, rowHeight, rowWidth, currentLeft } = this.state;
    if (isSwipeableViewRendered && rowHeight && rowWidth) {
      slideOutView = (
        <View
          style={[styles.slideOutContainer, { height: rowHeight }]}
        >
          {this.props.slideoutView}
        </View>
      );
    }

    // The swipeable item
    const swipeableView = (
      <Animated.View
        onLayout={this._onSwipeableViewLayout}
        style={{ transform: [{ translateX: currentLeft }] }}
      >
        {this.props.children}
      </Animated.View>
    );

    return (
      <View {...this._panResponder.panHandlers}>
        {slideOutView}
        {swipeableView}
      </View>
    );
  }

  close(): void {
    this.props.onClose && this.props.onClose();
    this._animateToClosedPosition();
  }

  _onSwipeableViewLayout = (event: LayoutChangeEvent): void => {
    this.setState({
      isSwipeableViewRendered: true,
      rowHeight: event.nativeEvent.layout.height,
      rowWidth: event.nativeEvent.layout.width,
    });
  };

  _isSwipingRightFromClosed(gestureState: PanResponderGestureState): boolean {
    const gestureStateDx = IS_RTL ? -gestureState.dx : gestureState.dx;
    return this._previousLeft === CLOSED_LEFT_POSITION && gestureStateDx > 0;
  }

  _swipeFullSpeed(gestureState: PanResponderGestureState): void {
    this.state.currentLeft.setValue(this._previousLeft + gestureState.dx);
  }

  _swipeSlowSpeed(gestureState: PanResponderGestureState): void {
    this.state.currentLeft.setValue(
      this._previousLeft + gestureState.dx / SLOW_SPEED_SWIPE_FACTOR,
    );
  }

  _isSwipingExcessivelyRightFromClosedPosition(
    gestureState: PanResponderGestureState,
  ): boolean {
    /**
     * We want to allow a BIT of right swipe, to allow users to know that
     * swiping is available, but swiping right does not do anything
     * functionally.
     */
    const gestureStateDx = IS_RTL ? -gestureState.dx : gestureState.dx;
    return (
      this._isSwipingRightFromClosed(gestureState) &&
      gestureStateDx > RIGHT_SWIPE_THRESHOLD
    );
  }

  _animateTo(
    toValue: number,
    duration: number = SWIPE_DURATION,
    callback: Function = emptyFunction,
  ): void {
    Animated.timing(this.state.currentLeft, {
      duration,
      toValue,
      useNativeDriver: true,
    }).start(() => {
      this._previousLeft = toValue;
      callback();
    });
  }

  _animateToOpenPosition(): void {
    const maxSwipeDistance = this.props.maxSwipeDistance ?? 0;
    const directionAwareMaxSwipeDistance = IS_RTL
      ? -maxSwipeDistance
      : maxSwipeDistance;
    this._animateTo(-directionAwareMaxSwipeDistance);
  }

  _animateToOpenPositionWith(speed: number, distMoved: number): void {
    /**
     * Ensure the speed is at least the set speed threshold to prevent a slow
     * swiping animation
     */
    speed =
      speed > HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD
        ? speed
        : HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD;
    const maxSwipeDistance = this.props.maxSwipeDistance ?? 0;
    /**
     * Calculate the duration the row should take to swipe the remaining distance
     * at the same speed the user swiped (or the speed threshold)
     */
    const duration = Math.abs((maxSwipeDistance - Math.abs(distMoved)) / speed);
    const directionAwareMaxSwipeDistance = IS_RTL
      ? -maxSwipeDistance
      : maxSwipeDistance;
    this._animateTo(-directionAwareMaxSwipeDistance, duration);
  }

  _animateToClosedPosition(duration: number = SWIPE_DURATION): void {
    this._animateTo(CLOSED_LEFT_POSITION, duration);
  }

  _animateToClosedPositionDuringBounce = (): void => {
    this._animateToClosedPosition(RIGHT_SWIPE_BOUNCE_BACK_DURATION);
  };

  _animateBounceBack(duration: number): void {
    /**
     * When swiping right, we want to bounce back past closed position on release
     * so users know they should swipe right to get content.
     */
    const swipeBounceBackDistance = IS_RTL
      ? -RIGHT_SWIPE_BOUNCE_BACK_DISTANCE
      : RIGHT_SWIPE_BOUNCE_BACK_DISTANCE;
    this._animateTo(
      -swipeBounceBackDistance,
      duration,
      this._animateToClosedPositionDuringBounce,
    );
  }

  // Ignore swipes due to user's finger moving slightly when tapping
  _isValidSwipe(gestureState: PanResponderGestureState): boolean {
    const preventSwipeRight = this.props.preventSwipeRight ?? false;
    if (
      preventSwipeRight &&
      this._previousLeft === CLOSED_LEFT_POSITION &&
      gestureState.dx > 0
    ) {
      return false;
    }

    return Math.abs(gestureState.dx) > HORIZONTAL_SWIPE_DISTANCE_THRESHOLD;
  }

  _shouldAnimateRemainder(gestureState: PanResponderGestureState): boolean {
    /**
     * If user has swiped past a certain distance, animate the rest of the way
     * if they let go
     */
    const swipeThreshold = this.props.swipeThreshold ?? DEFAULT_SWIPE_THRESHOLD;
    return (
      Math.abs(gestureState.dx) > swipeThreshold ||
      gestureState.vx > HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD
    );
  }
}

const styles = StyleSheet.create({
  slideOutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});