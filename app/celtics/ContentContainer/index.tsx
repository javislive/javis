import React, { Fragment, PureComponent, ReactElement } from 'react';

export interface Props {
  renderContent?: () => null | ReactElement;
}
export class ContentContainer<T = {}> extends PureComponent<Props & T> {
  private mounted = false;
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  update() {
    if (!this.mounted) {
      return;
    }
    this.forceUpdate();
  }
  renderContent(): null | JSX.Element {
    return null;
  }
  render() {
    const { renderContent } = this.props;
    if (renderContent) {
      return renderContent();
    } else {
      return this.renderContent();
    }
  }
}
