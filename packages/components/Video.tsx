import React, { PureComponent } from "react";
import ReactVideo, { VideoProperties } from "react-native-video";

interface Props extends VideoProperties {}
class Video extends PureComponent<Props> {
  render() {
    const { props } = this;
    return <ReactVideo {...props} />;
  }
}

export default Video;
